"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

function ProfileContent() {
	const { user } = useAuth();

	// Helper function to get user role and display info (same logic as layout.jsx)
	// const getUserRoleInfo = () => {
	// 	if (!user) return { role: null, title: "", icon: "U" };

	// 	const firstLetter = user.name?.charAt(0)?.toUpperCase() || "U";

	// 	if (firstLetter === "A" || user.email?.includes("admin")) {
	// 		return { role: "admin", title: "School Administrator", icon: "A" };
	// 	} else if (firstLetter === "T" || user.email?.includes("teacher")) {
	// 		return { role: "teacher", title: "Class Teacher", icon: "T" };
	// 	} else if (firstLetter === "S" || user.email?.includes("student")) {
	// 		return { role: "student", title: "Grade 8 Student", icon: "S" };
	// 	} else {
	// 		return { role: "user", title: "User", icon: firstLetter };
	// 	}
	// };

	// Helper function to get user role based on login context
	const getUserRoleInfo = () => {
		if (!user) return { role: null, title: "", icon: "U" };

		// Determine role based on login context - this should come from the auth context
		// For now, we'll use a simple approach based on the current implementation
		// In a real app, this would be stored in the user object during login

		// Check if user has a role property (set during login)
		if (user.role) {
			switch (user.role) {
				case "admin":
					return { role: "admin", title: "School Administrator", icon: "A" };
				case "teacher":
					return { role: "teacher", title: "Class Teacher", icon: "T" };
				case "student":
					return { role: "student", title: "Grade 8 Student", icon: "S" };
				default:
					return { role: "user", title: "User", icon: "U" };
			}
		}

		// Fallback to name-based detection for demo purposes
		const firstLetter = user.name?.charAt(0)?.toUpperCase() || "U";
		if (firstLetter === "A" || user.email?.includes("admin")) {
			return { role: "admin", title: "School Administrator", icon: "A" };
		} else if (firstLetter === "T" || user.email?.includes("teacher")) {
			return { role: "teacher", title: "Class Teacher", icon: "T" };
		} else if (firstLetter === "S" || user.email?.includes("student")) {
			return { role: "student", title: "Grade 8 Student", icon: "S" };
		} else {
			return { role: "user", title: "User", icon: firstLetter };
		}
	};

	const userRoleInfo = getUserRoleInfo();

	// Helper function to get the correct dashboard route based on user role
	const getDashboardRoute = () => {
		switch (userRoleInfo.role) {
			case "admin":
				return "/admin";
			case "teacher":
				return "/teacher";
			case "student":
				return "/student";
			default:
				return "/dashboard"; // fallback
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
					<div className="bg-gradient-to-r from-[#037764] to-[#025a4a] px-6 py-8">
						<div className="flex items-center">
							<div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-6">
								<span className="text-2xl font-bold text-[#037764]">{userRoleInfo.icon}</span>
							</div>
							<div>
								<h1 className="text-3xl font-bold text-white">{user?.name || "User"}</h1>
								<p className="text-[#F9FEFA]/90 mt-1">{user?.email}</p>
								<div className="mt-2">
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">{userRoleInfo.title}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions - Role-based */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Dashboard card - show for all users */}
					<Link href={getDashboardRoute()} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
						<div className="flex items-center">
							<div className="w-12 h-12 bg-[#037764]/20 rounded-lg flex items-center justify-center mr-4">
								<svg className="w-6 h-6 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
								<p className="text-gray-600 text-sm">View overview and analytics</p>
							</div>
						</div>
					</Link>

					{/* Students card - show for admin and teacher only */}
					{(userRoleInfo.role === "admin" || userRoleInfo.role === "teacher") && (
						<Link href="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<div className="flex items-center">
								<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
									<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">Students</h3>
									<p className="text-gray-600 text-sm">Manage student records</p>
								</div>
							</div>
						</Link>
					)}

					{/* Teachers card - show for admin only */}
					{userRoleInfo.role === "admin" && (
						<Link href="/teachers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<div className="flex items-center">
								<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
									<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">Teachers</h3>
									<p className="text-gray-600 text-sm">Manage teaching staff</p>
								</div>
							</div>
						</Link>
					)}
				</div>

				{/* Profile Information */}
				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
					</div>

					<div className="px-6 py-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
								<p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">{user?.name || "Not provided"}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
								<p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">{user?.email || "Not provided"}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
								<p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">{userRoleInfo.title}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
								<p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
								<p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
								</p>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-gray-200">
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/profile/edit" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764]">
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
									Edit Profile
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	return (
		<ProtectedRoute>
			<ProfileContent />
		</ProtectedRoute>
	);
}
