"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

function StudentDashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			// User is logged in, show dashboard
			return;
		} else if (!loading && !user) {
			// User is not logged in, redirect to login
			router.push("/login");
		}
	}, [user, loading, router]);

	const [attendanceSummary, setAttendanceSummary] = useState({ daysRecorded: 0, present: 0, absent: 0 });
	const [sidebarOpen, setSidebarOpen] = useState(true);

	useEffect(() => {
		try {
			const recordsRaw = localStorage.getItem("attendanceRecords");
			if (!recordsRaw || !user?.teacherId) {
				setAttendanceSummary({ daysRecorded: 0, present: 0, absent: 0 });
				return;
			}
			const records = JSON.parse(recordsRaw);
			const byDate = records?.teachers || {};
			let daysRecorded = 0;
			let present = 0;
			let absent = 0;
			for (const dateKey of Object.keys(byDate)) {
				const map = byDate[dateKey] || {};
				const status = map[user.teacherId];
				if (status) {
					daysRecorded += 1;
					if (status === "present" || status === "late") present += 1;
					if (status === "absent") absent += 1;
				}
			}
			setAttendanceSummary({ daysRecorded, present, absent });
		} catch (_e) {
			setAttendanceSummary({ daysRecorded: 0, present: 0, absent: 0 });
		}
	}, [user]);

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
			<Sidebar userRole="teacher" />

			{/* Main Content */}
			<main className="p-6 transition-all duration-300 md:ml-64">
				{/* Welcome Header */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Good morning, {user?.name?.split(" ")[0] || "Teacher"}! 👋</h2>
					<div className="flex items-center space-x-6 text-sm text-gray-600">
						<span className="flex items-center space-x-2">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
							<span>Attendance</span>
						</span>
						<span className="flex items-center space-x-2">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2" />
							</svg>
							<Link href="/attendance" className="text-[#037764] hover:underline">
								Mark today's
							</Link>
						</span>
						<span className="flex items-center space-x-2">
							<div className="w-2 h-2 bg-[#FED703] rounded-full"></div>
							<span>Quick access</span>
						</span>
					</div>
				</div>

				{/* Motivation Banner */}
				<div className="bg-gradient-to-r from-[#037764] to-[#025a4a] rounded-xl p-6 mb-8 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold mb-2">Daily Learning Tip</h3>
							<p className="text-[#F9FEFA]/90">"Every expert was once a beginner. Keep practicing, stay curious, and celebrate your progress—no matter how small!"</p>
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
					{/* My Attendance Card */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">My Attendance</h3>
							<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Days Recorded</p>
									<p className="text-sm text-gray-600">Attendance days logged</p>
								</div>
								<span className="text-2xl font-bold text-[#037764]">{attendanceSummary.daysRecorded}</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Days Present</p>
									<p className="text-sm text-gray-600">Includes late as present</p>
								</div>
								<span className="text-2xl font-bold text-green-600">{attendanceSummary.present}</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Days Absent</p>
									<p className="text-sm text-gray-600">From logged attendance</p>
								</div>
								<span className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</span>
							</div>
						</div>

						<Link href="/attendance" className="w-full mt-4 bg-[#037764] text-white py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium text-center block">
							Mark Student Attendance
						</Link>
					</div>

					{/* Today's Lessons Card */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Today's Lessons</h3>
							<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Mathematics</p>
									<p className="text-sm text-gray-600">Algebra - Linear Equations</p>
								</div>
								<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">English</p>
									<p className="text-sm text-gray-600">Literature - Poetry Analysis</p>
								</div>
								<span className="px-2 py-1 bg-[#037764]/20 text-[#037764] text-xs font-medium rounded-full">In Progress</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Science</p>
									<p className="text-sm text-gray-600">Physics - Motion & Forces</p>
								</div>
								<span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Upcoming</span>
							</div>
						</div>

						<button className="w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium">View All Lessons</button>
					</div>

					{/* My Assignments Panel */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">My Assignments</h3>
							<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-[#037764]/10 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">English Essay</p>
									<p className="text-sm text-gray-600">Due Friday</p>
								</div>
								<span className="px-2 py-1 bg-[#037764]/20 text-[#037764] text-xs font-medium rounded-full">In Progress</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
								<div>
									<p className="font-medium text-gray-900">Science Lab Report</p>
									<p className="text-sm text-gray-600">Submitted</p>
								</div>
								<span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
							</div>
						</div>

						<button className="w-full mt-4 bg-[#037764] text-white py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium">View All Assignments</button>
					</div>

					{/* My Progress Card */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">My Progress</h3>
							<svg className="w-5 h-5 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Mathematics</span>
								<span className="text-sm font-medium text-green-600">85%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">English</span>
								<span className="text-sm font-medium text-[#037764]">92%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div className="bg-[#037764] h-2 rounded-full" style={{ width: "92%" }}></div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-600">Science</span>
								<span className="text-sm font-medium text-[#037764]">78%</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div className="bg-[#037764] h-2 rounded-full" style={{ width: "78%" }}></div>
							</div>
						</div>

						<button className="w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium">View Detailed Report</button>
					</div>
				</div>
			</main>
		</div>
	);
}

function TeacherDashboardWrapper() {
	return (
		<ProtectedRoute requiredRole="teacher">
			<StudentDashboard />
		</ProtectedRoute>
	);
}

export default TeacherDashboardWrapper;
