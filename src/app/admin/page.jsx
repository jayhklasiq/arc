"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function AdminDashboard() {
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
				{/* Sidebar */}
				{/* <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
					<nav className="p-6 space-y-2">
						<Link href="/admin" className="flex items-center space-x-3 px-4 py-3 text-[#037764] bg-[#037764]/10 rounded-lg font-medium">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
							</svg>
							<span>Dashboard</span>
						</Link>

						<Link href="/lesson-plans" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#037764] hover:bg-gray-50 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
							</svg>
							<span>Lesson Plans</span>
						</Link>

						<Link href="/teachers" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#037764] hover:bg-gray-50 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
							</svg>
							<span>Teachers</span>
						</Link>

						<Link href="/students" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#037764] hover:bg-gray-50 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
							</svg>
							<span>Students</span>
						</Link>

						<Link href="/analytics" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#037764] hover:bg-gray-50 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
							<span>Analytics</span>
						</Link>

						<Link href="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-[#037764] hover:bg-gray-50 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
								/>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span>Settings</span>
						</Link>
					</nav>
				</aside> */}
				<Sidebar userRole="admin" />

				{/* Main Content */}
				<main className="flex-1 p-6">
					{/* Welcome Header */}
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Good morning, {user?.name?.split(" ")[0] || "Admin"}! 👋</h2>
						<div className="flex items-center space-x-6 text-sm text-gray-600">
							<span className="flex items-center space-x-2">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
								</svg>
								<span>142 teachers</span>
							</span>
							<span className="flex items-center space-x-2">
								<div className="w-2 h-2 bg-[#FED703] rounded-full"></div>
								<span>3 pending approvals</span>
							</span>
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
									<span className="text-2xl font-bold text-[#037764]">94%</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Student Attendance</p>
										<p className="text-sm text-gray-600">This month average</p>
									</div>
									<span className="text-2xl font-bold text-green-600">87%</span>
								</div>
							</div>

							<div className="flex space-x-2 mt-4">
								<Link href="/attendance" className="flex-1 bg-[#037764] text-white py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium text-center">
									Mark Teacher Attendance
								</Link>
							</div>
						</div>

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
									<span className="text-2xl font-bold text-[#037764]">94%</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Student Attendance</p>
										<p className="text-sm text-gray-600">This month average</p>
									</div>
									<span className="text-2xl font-bold text-green-600">87%</span>
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
										<p className="text-sm text-gray-600">Across all schools</p>
									</div>
									<span className="text-2xl font-bold text-[#037764]">2,847</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
									<div>
										<p className="font-medium text-gray-900">Total Teachers</p>
										<p className="text-sm text-gray-600">Active staff members</p>
									</div>
									<span className="text-2xl font-bold text-purple-600">142</span>
								</div>
							</div>

							<button className="w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium">View Detailed Reports</button>
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
										<p className="font-medium text-gray-900">Pending Updates</p>
										<p className="text-sm text-gray-600">System maintenance</p>
									</div>
									<span className="px-2 py-1 bg-[#FED703]/20 text-yellow-800 text-xs font-medium rounded-full">3 Updates</span>
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
									<span className="text-sm text-gray-600">Teacher onboarding</span>
									<span className="text-sm font-medium text-[#037764]">8 completed</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-[#037764] h-2 rounded-full" style={{ width: "75%" }}></div>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600">System usage</span>
									<span className="text-sm font-medium text-[#037764]">94% active</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-[#037764] h-2 rounded-full" style={{ width: "94%" }}></div>
								</div>
							</div>

							<button className="w-full mt-4 text-[#037764] hover:bg-[#037764]/5 py-2 rounded-lg transition-colors font-medium">View All Activity</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}