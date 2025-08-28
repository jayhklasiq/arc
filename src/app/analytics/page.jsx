"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

function AnalyticsContent() {
	const { user } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [analyticsData, setAnalyticsData] = useState({
		// Student analytics
		totalStudents: 0,
		activeStudents: 0,
		graduatedStudents: 0,
		transferredStudents: 0,
		withdrawnStudents: 0,
		averageStudentAge: 0,
		studentsPerClass: {},

		// Teacher analytics
		totalTeachers: 0,
		activeTeachers: 0,
		retiredTeachers: 0,
		resignedTeachers: 0,
		averageTeacherAge: 0,
		subjectDistribution: {},

		// Attendance analytics
		teacherAttendanceHistory: [],
		studentAttendanceHistory: [],
		attendanceTrends: {},
		bestAttendanceDay: "",
		worstAttendanceDay: "",

		// General analytics
		enrollmentTrends: [],
		staffTurnover: 0,
		studentRetention: 0,
	});

	// Check if user has permission to view analytics
	const hasPermission = user && (user.role === "admin" || user.role === "teacher");

	useEffect(() => {
		if (!hasPermission) {
			setLoading(false);
			return;
		}

		const calculateAnalytics = () => {
			try {
				const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
				const students = JSON.parse(localStorage.getItem("students") || "[]");
				const attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

				// Student Analytics
				const totalStudents = students.length;
				const activeStudents = students.filter((s) => s.studentStatus === "active").length;
				const graduatedStudents = students.filter((s) => s.studentStatus === "graduated").length;
				const transferredStudents = students.filter((s) => s.studentStatus === "transferred").length;
				const withdrawnStudents = students.filter((s) => s.studentStatus === "withdrawn").length;

				// Calculate average student age
				const studentAges = students.filter((s) => s.age && !isNaN(s.age)).map((s) => parseInt(s.age));
				const averageStudentAge = studentAges.length > 0 ? Math.round(studentAges.reduce((sum, age) => sum + age, 0) / studentAges.length) : 0;

				// Students per class distribution
				const studentsPerClass = students
					.filter((s) => s.studentStatus === "active" && s.class)
					.reduce((acc, student) => {
						acc[student.class] = (acc[student.class] || 0) + 1;
						return acc;
					}, {});

				// Teacher Analytics
				const totalTeachers = teachers.length;
				const activeTeachers = teachers.filter((t) => t.employmentStatus === "active").length;
				const retiredTeachers = teachers.filter((t) => t.employmentStatus === "retired").length;
				const resignedTeachers = teachers.filter((t) => t.employmentStatus === "resigned").length;

				// Calculate average teacher age
				const teacherAges = teachers.filter((t) => t.age && !isNaN(t.age)).map((t) => parseInt(t.age));
				const averageTeacherAge = teacherAges.length > 0 ? Math.round(teacherAges.reduce((sum, age) => sum + age, 0) / teacherAges.length) : 0;

				// Subject distribution
				const subjectDistribution = {};
				teachers
					.filter((t) => t.employmentStatus === "active" && t.subjectsTaught)
					.forEach((teacher) => {
						if (Array.isArray(teacher.subjectsTaught)) {
							teacher.subjectsTaught.forEach((subject) => {
								if (subject.trim()) {
									subjectDistribution[subject.trim()] = (subjectDistribution[subject.trim()] || 0) + 1;
								}
							});
						}
					});

				// Attendance Analytics
				const teacherAttendanceHistory = [];
				const studentAttendanceHistory = [];
				const attendanceTrends = {};

				if (attendanceRecords.teachers) {
					Object.entries(attendanceRecords.teachers).forEach(([date, records]) => {
						const totalTeachers = Object.keys(records).length;
						const presentTeachers = Object.values(records).filter((status) => status === "present" || status === "late").length;
						const attendanceRate = totalTeachers > 0 ? Math.round((presentTeachers / totalTeachers) * 100) : 0;

						teacherAttendanceHistory.push({
							date,
							attendanceRate,
							present: presentTeachers,
							total: totalTeachers,
						});
					});
				}

				if (attendanceRecords.students) {
					Object.entries(attendanceRecords.students).forEach(([date, records]) => {
						const totalStudents = Object.keys(records).length;
						const presentStudents = Object.values(records).filter((status) => status === "present" || status === "late").length;
						const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

						studentAttendanceHistory.push({
							date,
							attendanceRate,
							present: presentStudents,
							total: totalStudents,
						});
					});
				}

				// Find best and worst attendance days
				const allAttendanceData = [...teacherAttendanceHistory, ...studentAttendanceHistory];
				const bestDay = allAttendanceData.reduce((best, current) => (current.attendanceRate > (best?.attendanceRate || 0) ? current : best), null);
				const worstDay = allAttendanceData.reduce((worst, current) => (current.attendanceRate < (worst?.attendanceRate || 100) ? current : worst), null);

				// Calculate staff turnover (percentage of non-active teachers)
				const staffTurnover = totalTeachers > 0 ? Math.round(((retiredTeachers + resignedTeachers) / totalTeachers) * 100) : 0;

				// Calculate student retention (percentage of active + graduated vs transferred + withdrawn)
				const retainedStudents = activeStudents + graduatedStudents;
				const lostStudents = transferredStudents + withdrawnStudents;
				const studentRetention = totalStudents > 0 ? Math.round((retainedStudents / totalStudents) * 100) : 0;

				setAnalyticsData({
					totalStudents,
					activeStudents,
					graduatedStudents,
					transferredStudents,
					withdrawnStudents,
					averageStudentAge,
					studentsPerClass,
					totalTeachers,
					activeTeachers,
					retiredTeachers,
					resignedTeachers,
					averageTeacherAge,
					subjectDistribution,
					teacherAttendanceHistory: teacherAttendanceHistory.slice(-7), // Last 7 days
					studentAttendanceHistory: studentAttendanceHistory.slice(-7), // Last 7 days
					attendanceTrends,
					bestAttendanceDay: bestDay?.date || "N/A",
					worstAttendanceDay: worstDay?.date || "N/A",
					staffTurnover,
					studentRetention,
				});
			} catch (error) {
				console.error("Error calculating analytics:", error);
			} finally {
				setLoading(false);
			}
		};

		calculateAnalytics();
	}, [hasPermission]);

	if (!hasPermission) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You don't have permission to view analytics.</p>
					<button onClick={() => router.back()} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F9FEFA]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<div className="flex">
				<Sidebar userRole={user?.role || "teacher"} />

				<main className="flex-1 p-6 transition-all duration-300 md:ml-64">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<button onClick={() => router.back()} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">School Analytics</h1>
									<p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<button onClick={() => window.print()} className="bg-[#037764] text-white px-4 py-2 rounded-lg hover:bg-[#025a4a] transition-colors text-sm font-medium">
									Export Report
								</button>
							</div>
						</div>
					</div>

					{/* Key Metrics Overview */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#037764] text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
										<dd className="text-lg font-medium text-gray-900">{analyticsData.totalStudents.toLocaleString()}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
										<dd className="text-lg font-medium text-gray-900">{analyticsData.totalTeachers}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Student Retention</dt>
										<dd className="text-lg font-medium text-gray-900">{analyticsData.studentRetention}%</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Staff Turnover</dt>
										<dd className="text-lg font-medium text-gray-900">{analyticsData.staffTurnover}%</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						{/* Student Status Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Student Status Distribution</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Active Students</span>
									<span className="text-sm font-medium text-green-600">{analyticsData.activeStudents}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-green-600 h-2 rounded-full" style={{ width: `${analyticsData.totalStudents > 0 ? (analyticsData.activeStudents / analyticsData.totalStudents) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Graduated Students</span>
									<span className="text-sm font-medium text-blue-600">{analyticsData.graduatedStudents}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analyticsData.totalStudents > 0 ? (analyticsData.graduatedStudents / analyticsData.totalStudents) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Transferred Students</span>
									<span className="text-sm font-medium text-yellow-600">{analyticsData.transferredStudents}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${analyticsData.totalStudents > 0 ? (analyticsData.transferredStudents / analyticsData.totalStudents) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Withdrawn Students</span>
									<span className="text-sm font-medium text-red-600">{analyticsData.withdrawnStudents}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-red-600 h-2 rounded-full" style={{ width: `${analyticsData.totalStudents > 0 ? (analyticsData.withdrawnStudents / analyticsData.totalStudents) * 100 : 0}%` }}></div>
								</div>
							</div>
						</div>

						{/* Teacher Status Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Teacher Employment Status</h3>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Active Teachers</span>
									<span className="text-sm font-medium text-green-600">{analyticsData.activeTeachers}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-green-600 h-2 rounded-full" style={{ width: `${analyticsData.totalTeachers > 0 ? (analyticsData.activeTeachers / analyticsData.totalTeachers) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Retired Teachers</span>
									<span className="text-sm font-medium text-blue-600">{analyticsData.retiredTeachers}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analyticsData.totalTeachers > 0 ? (analyticsData.retiredTeachers / analyticsData.totalTeachers) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Resigned Teachers</span>
									<span className="text-sm font-medium text-orange-600">{analyticsData.resignedTeachers}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-orange-600 h-2 rounded-full" style={{ width: `${analyticsData.totalTeachers > 0 ? (analyticsData.resignedTeachers / analyticsData.totalTeachers) * 100 : 0}%` }}></div>
								</div>
							</div>

							<div className="mt-4 p-3 bg-gray-50 rounded-lg">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Average Teacher Age:</span>
									<span className="font-medium text-gray-900">{analyticsData.averageTeacherAge} years</span>
								</div>
							</div>
						</div>

						{/* Class Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Students per Class</h3>
							<div className="space-y-3">
								{Object.entries(analyticsData.studentsPerClass)
									.sort(([, a], [, b]) => b - a)
									.slice(0, 8)
									.map(([className, count]) => (
										<div key={className} className="flex items-center justify-between">
											<span className="text-sm text-gray-600">{className}</span>
											<span className="text-sm font-medium text-[#037764]">{count} students</span>
										</div>
									))}
								{Object.keys(analyticsData.studentsPerClass).length === 0 && <p className="text-sm text-gray-500 italic">No class data available</p>}
							</div>

							<div className="mt-4 p-3 bg-gray-50 rounded-lg">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Average Student Age:</span>
									<span className="font-medium text-gray-900">{analyticsData.averageStudentAge} years</span>
								</div>
							</div>
						</div>

						{/* Subject Distribution */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Coverage</h3>
							<div className="space-y-3">
								{Object.entries(analyticsData.subjectDistribution)
									.sort(([, a], [, b]) => b - a)
									.slice(0, 8)
									.map(([subject, teacherCount]) => (
										<div key={subject} className="flex items-center justify-between">
											<span className="text-sm text-gray-600">{subject}</span>
											<span className="text-sm font-medium text-purple-600">
												{teacherCount} teacher{teacherCount !== 1 ? "s" : ""}
											</span>
										</div>
									))}
								{Object.keys(analyticsData.subjectDistribution).length === 0 && <p className="text-sm text-gray-500 italic">No subject data available</p>}
							</div>
						</div>
					</div>

					{/* Attendance Trends */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance Trends (Last 7 Days)</h3>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Teacher Attendance */}
							<div>
								<h4 className="text-md font-medium text-gray-700 mb-3">Teacher Attendance</h4>
								<div className="space-y-2">
									{analyticsData.teacherAttendanceHistory.length > 0 ? (
										analyticsData.teacherAttendanceHistory.map((record, index) => (
											<div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
												<span className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
												<div className="flex items-center space-x-2">
													<span className="text-sm font-medium text-[#037764]">
														{record.present}/{record.total}
													</span>
													<span className="text-sm text-gray-500">({record.attendanceRate}%)</span>
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 italic">No recent attendance data</p>
									)}
								</div>
							</div>

							{/* Student Attendance */}
							<div>
								<h4 className="text-md font-medium text-gray-700 mb-3">Student Attendance</h4>
								<div className="space-y-2">
									{analyticsData.studentAttendanceHistory.length > 0 ? (
										analyticsData.studentAttendanceHistory.map((record, index) => (
											<div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
												<span className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</span>
												<div className="flex items-center space-x-2">
													<span className="text-sm font-medium text-green-600">
														{record.present}/{record.total}
													</span>
													<span className="text-sm text-gray-500">({record.attendanceRate}%)</span>
												</div>
											</div>
										))
									) : (
										<p className="text-sm text-gray-500 italic">No recent attendance data</p>
									)}
								</div>
							</div>
						</div>

						{/* Attendance Insights */}
						<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-4 bg-green-50 rounded-lg">
								<h5 className="text-sm font-medium text-green-800">Best Attendance Day</h5>
								<p className="text-lg font-semibold text-green-900">{analyticsData.bestAttendanceDay !== "N/A" ? new Date(analyticsData.bestAttendanceDay).toLocaleDateString() : "N/A"}</p>
							</div>
							<div className="p-4 bg-red-50 rounded-lg">
								<h5 className="text-sm font-medium text-red-800">Lowest Attendance Day</h5>
								<p className="text-lg font-semibold text-red-900">{analyticsData.worstAttendanceDay !== "N/A" ? new Date(analyticsData.worstAttendanceDay).toLocaleDateString() : "N/A"}</p>
							</div>
						</div>
					</div>

					{/* Additional Insights */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<div className="p-4 bg-blue-50 rounded-lg">
								<h5 className="text-sm font-medium text-blue-800">Student-Teacher Ratio</h5>
								<p className="text-lg font-semibold text-blue-900">{analyticsData.activeTeachers > 0 ? Math.round(analyticsData.activeStudents / analyticsData.activeTeachers) : 0}:1</p>
								<p className="text-xs text-blue-600 mt-1">Students per teacher</p>
							</div>

							<div className="p-4 bg-purple-50 rounded-lg">
								<h5 className="text-sm font-medium text-purple-800">Total Classes</h5>
								<p className="text-lg font-semibold text-purple-900">{Object.keys(analyticsData.studentsPerClass).length}</p>
								<p className="text-xs text-purple-600 mt-1">Active classes</p>
							</div>

							<div className="p-4 bg-yellow-50 rounded-lg">
								<h5 className="text-sm font-medium text-yellow-800">Subjects Offered</h5>
								<p className="text-lg font-semibold text-yellow-900">{Object.keys(analyticsData.subjectDistribution).length}</p>
								<p className="text-xs text-yellow-600 mt-1">Different subjects</p>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function AnalyticsPage() {
	return (
		<ProtectedRoute>
			<AnalyticsContent />
		</ProtectedRoute>
	);
}
