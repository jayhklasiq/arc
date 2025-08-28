"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

function AdminDashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [teacherPct, setTeacherPct] = useState(0);
	const [studentPct, setStudentPct] = useState(0);
	const [totalStudents, setTotalStudents] = useState(0);
	const [totalTeachers, setTotalTeachers] = useState(0);
	const [activeStudents, setActiveStudents] = useState(0);
	const [activeTeachers, setActiveTeachers] = useState(0);

	useEffect(() => {
		if (!loading && user) {
			// User is logged in, show dashboard
			return;
		} else if (!loading && !user) {
			// User is not logged in, redirect to login
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		try {
			const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
			const students = JSON.parse(localStorage.getItem("students") || "[]");
			const records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");

			// Calculate totals
			setTotalTeachers(teachers.length);
			setTotalStudents(students.length);

			// Calculate active counts (only active status)
			const activeTeachersCount = teachers.filter((teacher) => teacher.employmentStatus === "active").length;
			const activeStudentsCount = students.filter((student) => student.studentStatus === "active").length;
			setActiveTeachers(activeTeachersCount);
			setActiveStudents(activeStudentsCount);

			// Calculate attendance percentages
			const latestTeacherDate = Object.keys(records?.teachers || {})
				.sort()
				.pop();
			const latestStudentDate = Object.keys(records?.students || {})
				.sort()
				.pop();
			const tByDate = (records?.teachers || {})[latestTeacherDate] || {};
			const sByDate = (records?.students || {})[latestStudentDate] || {};
			const teacherPresent = Object.values(tByDate).filter((v) => v === "present" || v === "late").length;
			const studentPresent = Object.values(sByDate).filter((v) => v === "present" || v === "late").length;
			setTeacherPct(activeTeachersCount ? Math.round((teacherPresent / activeTeachersCount) * 100) : 0);
			setStudentPct(activeStudentsCount ? Math.round((studentPresent / activeStudentsCount) * 100) : 0);
		} catch (_e) {
			setTeacherPct(0);
			setStudentPct(0);
			setTotalStudents(0);
			setTotalTeachers(0);
			setActiveStudents(0);
			setActiveTeachers(0);
		}
	}, [loading]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F9FEFA]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!user) {
		return null; // Will redirect to login
	}

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<div className="flex">
				<Sidebar userRole="admin" />

				{/* Main Content */}
				<main className="flex-1 p-6 transition-all duration-300 md:ml-64">
					{/* Welcome Header */}
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Good morning, {user?.name?.split(" ")[0] || "Admin"}! 👋</h2>
						<div className="flex items-center space-x-6 text-sm text-gray-600">
							{(() => {
								try {
									const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
									const students = JSON.parse(localStorage.getItem("students") || "[]");
									const records = JSON.parse(localStorage.getItem("attendanceRecords") || "{}");
									const latestDate = Object.keys(records?.teachers || {})
										.sort()
										.pop();
									const latestStudentsDate = Object.keys(records?.students || {})
										.sort()
										.pop();

									const tByDate = (records?.teachers || {})[latestDate] || {};
									const sByDate = (records?.students || {})[latestStudentsDate] || {};

									const activeTeachersCount = teachers.filter((teacher) => teacher.employmentStatus === "active").length;
									const activeStudentsCount = students.filter((student) => student.studentStatus === "active").length;

									const teacherPresent = Object.values(tByDate).filter((v) => v === "present" || v === "late").length;
									const studentPresent = Object.values(sByDate).filter((v) => v === "present" || v === "late").length;

									const teacherPct = activeTeachersCount ? Math.round((teacherPresent / activeTeachersCount) * 100) : 0;
									const studentPct = activeStudentsCount ? Math.round((studentPresent / activeStudentsCount) * 100) : 0;

									return (
										<>
											<span className="flex items-center space-x-2">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
												</svg>
												<span>Teachers present: {teacherPct}%</span>
											</span>
											<span className="flex items-center space-x-2">
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
												</svg>
												<span>Students present: {studentPct}%</span>
											</span>
										</>
									);
								} catch (_e) {
									return null;
								}
							})()}
						</div>
					</div>

					{/* Motivation Banner */}
					<div className="bg-gradient-to-r from-[#037764] to-[#025a4a] rounded-xl p-6 mb-8 text-white">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-semibold mb-2">Weekly Admin Insight</h3>
								<p className="text-[#F9FEFA]/90">"Great leadership in education means empowering teachers to innovate while ensuring every student has the support they need to succeed."</p>
							</div>
							<div className="hidden md:block">
								<svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
								</svg>
							</div>
						</div>
					</div>

					{/* Dashboard Cards Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
						{/* Overall Attendance Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">Overall Attendance</h3>
								<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Teacher Attendance</p>
										<p className="text-sm text-gray-600">This month average</p>
									</div>
									<span className="text-2xl font-bold text-[#037764]">{teacherPct}%</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Student Attendance</p>
										<p className="text-sm text-gray-600">This month average</p>
									</div>
									<span className="text-2xl font-bold text-green-600">{studentPct}%</span>
								</div>
							</div>

							<div className="flex space-x-2 mt-4">
								<Link href="/attendance" className="flex-1 bg-[#037764] text-white py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium text-center">
									Mark Teacher Attendance
								</Link>
							</div>
						</div>

						{/* School Overview Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">School Overview</h3>
								<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Total Students</p>
										<p className="text-sm text-gray-600">
											{activeStudents} active, {totalStudents - activeStudents} former
										</p>
									</div>
									<span className="text-2xl font-bold text-[#037764]">{totalStudents.toLocaleString()}</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Total Teachers</p>
										<p className="text-sm text-gray-600">
											{activeTeachers} active, {totalTeachers - activeTeachers} former
										</p>
									</div>
									<span className="text-2xl font-bold text-purple-600">{totalTeachers}</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2 mt-4">
								<Link href="/students" className="text-center text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium text-sm">
									Manage Students
								</Link>
								<Link href="/teachers" className="text-center text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium text-sm">
									Manage Teachers
								</Link>
							</div>
						</div>

						{/* System Health Panel */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">System Health</h3>
								<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Server Status</p>
										<p className="text-sm text-gray-600">All systems operational</p>
									</div>
									<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Online</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-[#FED703]/10 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Data Storage</p>
										<p className="text-sm text-gray-600">{totalStudents + totalTeachers} records stored</p>
									</div>
									<span className="px-2 py-1 bg-[#FED703]/20 text-yellow-800 text-xs font-medium rounded-full">Active</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Data Backup</p>
										<p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
									</div>
									<span className="px-2 py-1 bg-[#037764]/20 text-[#037764] text-xs font-medium rounded-full">Current</span>
								</div>
							</div>

							<button className="w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium">System Dashboard</button>
						</div>

						{/* Recent Activity Card */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
								<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Active Teachers</span>
									<span className="text-sm font-medium text-[#037764]">
										{activeTeachers} of {totalTeachers}
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-[#037764] h-2 rounded-full" style={{ width: `${totalTeachers > 0 ? (activeTeachers / totalTeachers) * 100 : 0}%` }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">Active Students</span>
									<span className="text-sm font-medium text-[#037764]">
										{activeStudents} of {totalStudents}
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-[#037764] h-2 rounded-full" style={{ width: `${totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0}%` }}></div>
								</div>
							</div>

							<Link href="/analytics" className="block w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium text-center">
								View Analytics
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function AdminDashboardWrapper() {
	return (
		<ProtectedRoute requiredRole="admin">
			<AdminDashboard />
		</ProtectedRoute>
	);
}

export default AdminDashboardWrapper;
