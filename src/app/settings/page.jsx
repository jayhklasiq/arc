"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

function SettingsContent() {
	const [activeTab, setActiveTab] = useState("profile");
	const { user } = useAuth();
	const [firstName, lastName] = (user?.name || "").split(" ");

	const tabs = [
		{ id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
		{ id: "notifications", label: "Notifications", icon: "M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84l3.12 3.12M4.03 8.86l3.12 3.12M1.01 11.88l3.12 3.12" },
		{ id: "security", label: "Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
		{ id: "quick-actions", label: "Quick Actions", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
	];

	return (
		<div className="min-h-screen bg-[#F9FEFA] py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
					<div className="bg-[#037764] px-6 py-8">
						<h1 className="text-3xl font-bold text-white">Settings</h1>
						<p className="text-[#F9FEFA]/90 mt-1">Manage your account preferences and quick actions</p>
					</div>
				</div>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar */}
					<div className="lg:w-1/4">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
							<nav className="space-y-2">
								{tabs.map((tab) => (
									<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === tab.id ? "text-[#037764] bg-[#037764]/10 font-medium" : "text-gray-700 hover:text-[#037764] hover:bg-gray-50"}`}>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
										</svg>
										<span>{tab.label}</span>
									</button>
								))}
							</nav>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:w-3/4">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200">
							{/* Profile Tab */}
							{activeTab === "profile" && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>

									<div className="space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
												<input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" defaultValue={firstName || ""} />
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
												<input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" defaultValue={lastName || ""} />
											</div>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
											<input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" defaultValue={user?.email || ""} />
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
											<input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" defaultValue="+1 (555) 123-4567" />
										</div>

										<div className="pt-4">
											<button className="bg-[#037764] text-white px-6 py-2 rounded-md hover:bg-[#025a4a] transition-colors">Save Changes</button>
										</div>
									</div>
								</div>
							)}

							{/* Notifications Tab */}
							{activeTab === "notifications" && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

									<div className="space-y-6">
										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
											<div>
												<h3 className="font-medium text-gray-900">Email Notifications</h3>
												<p className="text-sm text-gray-600">Receive notifications via email</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input type="checkbox" className="sr-only peer" defaultChecked />
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#037764]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037764]"></div>
											</label>
										</div>

										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
											<div>
												<h3 className="font-medium text-gray-900">Push Notifications</h3>
												<p className="text-sm text-gray-600">Receive push notifications in browser</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input type="checkbox" className="sr-only peer" />
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#037764]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037764]"></div>
											</label>
										</div>

										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
											<div>
												<h3 className="font-medium text-gray-900">Assignment Reminders</h3>
												<p className="text-sm text-gray-600">Get reminded about upcoming assignments</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input type="checkbox" className="sr-only peer" defaultChecked />
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#037764]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#037764]"></div>
											</label>
										</div>
									</div>
								</div>
							)}

							{/* Security Tab */}
							{activeTab === "security" && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

									<div className="space-y-6">
										<div>
											<h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
											<div className="space-y-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
													<input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
													<input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
													<input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
												</div>
												<button className="bg-[#037764] text-white px-6 py-2 rounded-md hover:bg-[#025a4a] transition-colors">Update Password</button>
											</div>
										</div>

										<div className="border-t border-gray-200 pt-6">
											<h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
											<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
												<div>
													<p className="font-medium text-gray-900">Enable 2FA</p>
													<p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
												</div>
												<button className="bg-[#037764] text-white px-4 py-2 rounded-md hover:bg-[#025a4a] transition-colors text-sm">Enable</button>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Quick Actions Tab */}
							{activeTab === "quick-actions" && (
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>

									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										<Link href="/lesson-plans/new" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">New Lesson</h3>
											<p className="text-sm text-gray-600 text-center">Create a new lesson plan for your students</p>
										</Link>

										<Link href="/assignments/new" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">Create Assignment</h3>
											<p className="text-sm text-gray-600 text-center">Design and assign homework or projects</p>
										</Link>

										<Link href="/messages/new" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">Send Message</h3>
											<p className="text-sm text-gray-600 text-center">Communicate with students or parents</p>
										</Link>

										<Link href="/reports" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">View Reports</h3>
											<p className="text-sm text-gray-600 text-center">Access student progress and analytics</p>
										</Link>

										<Link href="/students/import" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">Import Data</h3>
											<p className="text-sm text-gray-600 text-center">Upload student or teacher information</p>
										</Link>

										<Link href="/backup" className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#037764] hover:bg-[#037764]/5 transition-colors group">
											<svg className="w-12 h-12 text-gray-400 group-hover:text-[#037764] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
											</svg>
											<h3 className="text-lg font-medium text-gray-900 mb-2">Backup Data</h3>
											<p className="text-sm text-gray-600 text-center">Download and backup your information</p>
										</Link>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SettingsPage() {
	return (
		<ProtectedRoute>
			<SettingsContent />
		</ProtectedRoute>
	);
}
