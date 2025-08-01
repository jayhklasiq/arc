"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// export const metadata = {
//   title: "School Management System",
//   description: "A comprehensive school management system",
// };

function Header() {
	const { user, logout, loading } = useAuth();

	// Helper function to get user role and display info
	const getUserRoleInfo = () => {
		// This would typically come from user data, but for now we'll infer from the current path
		// In a real app, you'd store the user role in the user object
		if (!user) return { role: null, title: "", icon: "U" };

		// For demo purposes, we'll use the first letter of the name to determine role
		// In production, this should come from the user's actual role data
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

	// Helper function to get user role and display info
	const getUserRoleInfo = () => {
		// This would typically come from user data, but for now we'll infer from the current path
		// In a real app, you'd store the user role in the user object
		if (!user) return { role: null, title: "", icon: "U" };

		// For demo purposes, we'll use the first letter of the name to determine role
		// In production, this should come from the user's actual role data
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

	if (loading) {
		return (
			<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex justify-between items-center">
						<div className="flex gap-2.5 items-center">
							<div className="w-8 h-8 bg-[#037764] rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">A</span>
							</div>
							<span className="text-xl font-semibold text-gray-900">Arc Education</span>
						</div>
						<div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
					</div>
				</div>
			</header>
		);
	}

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex justify-between items-center">
					<Link href="/" className="flex gap-2.5 items-center">
						<div className="w-8 h-8 bg-[#037764] rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">A</span>
						</div>
						<span className="text-xl font-semibold text-gray-900">Arc Education</span>
					</Link>

					<nav className="flex items-center space-x-4">
						{user ? (
							<>
								{/* Navigation Links - only show for logged in users */}
								<Link href="/" className="text-gray-700 hover:text-[#037764] px-3 py-2 text-sm font-medium">
									Home
								</Link>
								<Link href="/students" className="text-gray-700 hover:text-[#037764] px-3 py-2 text-sm font-medium">
									Students
								</Link>
								<Link href="/teachers" className="text-gray-700 hover:text-[#037764] px-3 py-2 text-sm font-medium">
									Teachers
								</Link>

								{/* Notifications */}
								<button className="relative p-2 text-gray-600 hover:text-[#037764] hover:bg-gray-100 rounded-lg transition-colors">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84l3.12 3.12M4.03 8.86l3.12 3.12M1.01 11.88l3.12 3.12" />
									</svg>
									<span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FED703] rounded-full"></span>
								</button>

								{/* Quick Actions - only show for admin and teacher */}
								{(userRoleInfo.role === "admin" || userRoleInfo.role === "teacher") && (
									<button className="bg-[#037764] text-white px-4 py-2 rounded-lg hover:bg-[#025a4a] transition-colors flex items-center space-x-2">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
										</svg>
										<span>Create New</span>
									</button>
								)}

								{/* User Profile */}
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center">
										<span className="text-white text-sm font-medium">{userRoleInfo.icon}</span>
									</div>
									<div className="hidden md:block">
										<p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
										<p className="text-xs text-gray-500">{userRoleInfo.title}</p>
									</div>

									{/* User Dropdown */}
									<div className="relative group">
										<button className="flex items-center text-sm font-medium text-gray-700 hover:text-[#037764] focus:outline-none">
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
											</svg>
										</button>
										<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
											<div className="py-1">
												<Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
													Your Profile
												</Link>
												<Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
													Settings
												</Link>
												<button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
													Sign out
												</button>
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<>
								{/* Public navigation - only show when not logged in */}
								<Link href="/" className="text-gray-700 hover:text-[#037764] px-3 py-2 text-sm font-medium">
									Home
								</Link>
								<Link href="/login" className="text-gray-700 hover:text-[#037764] px-3 py-2 text-sm font-medium">
									Login
								</Link>
								<Link href="/signup" className="bg-[#037764] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#025a4a] transition-colors">
									Sign up
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}>
				<AuthProvider>
					<div className="min-h-screen flex flex-col">
						<Header />
						<main className="flex-grow">{children}</main>
						<footer className="bg-white border-t border-gray-200 mt-8">
							<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
								<p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} School Management System. All rights reserved.</p>
							</div>
						</footer>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
