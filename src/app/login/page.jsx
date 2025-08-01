"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
	const [selectedRole, setSelectedRole] = useState(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	// Check if running in local development
	const isLocalDev = process.env.NEXT_PUBLIC_IS_LOCAL_DEV === "true";
	const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
	const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

	const handleRoleSelection = (role) => {
		setSelectedRole(role);
		setError("");
	};

	const handleBackToRoleSelection = () => {
		setSelectedRole(null);
		setEmail("");
		setPassword("");
		setRememberMe(false);
		setError("");
	};

	// Helper function to get the correct dashboard route based on role
	const getDashboardRoute = (role) => {
		switch (role) {
			case "admin":
				return "/admin";
			case "teacher":
				return "/teacher";
			case "student":
				return "/student";
			default:
				return "/dashboard";
		}
	};

	const handleDemoLogin = async () => {
		if (!demoEmail || !demoPassword) {
			setError("Demo credentials not configured");
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			const result = await login(demoEmail, demoPassword, rememberMe);

			if (result.success) {
				// Redirect to the appropriate dashboard based on selected role
				const dashboardRoute = getDashboardRoute(selectedRole || "admin"); // Default to admin for demo
				router.push(dashboardRoute);
			} else {
				setError(result.error || "Demo login failed");
			}
		} catch (err) {
			setError("Demo login error occurred");
			console.error("Demo login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await login(email, password, rememberMe);

			if (result.success) {
				// Redirect to the appropriate dashboard based on selected role
				const dashboardRoute = getDashboardRoute(selectedRole);
				router.push(dashboardRoute);
			} else {
				setError(result.error || "Login failed. Please try again.");
			}
		} catch (err) {
			setError("An unexpected error occurred. Please try again.");
			console.error("Login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Role selection screen
	if (!selectedRole) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Arc</h2>
						<p className="mt-2 text-center text-sm text-gray-600">Choose your role to continue</p>
					</div>

					{/* Demo Login Button for Local Development */}
					{isLocalDev && demoEmail && demoPassword && (
						<div className="mb-6">
							<button onClick={handleDemoLogin} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border-2 border-dashed border-[#037764]/30 rounded-md text-sm font-medium text-[#037764] bg-[#037764]/5 hover:bg-[#037764]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764] transition-colors">
								🚀 Quick Demo Login (Local Dev)
							</button>
							<p className="text-xs text-gray-500 text-center mt-2">Using credentials from .env.local file</p>
						</div>
					)}

					<div className="space-y-4">
						<button onClick={() => handleRoleSelection("admin")} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764] transition-colors">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
								<div className="text-left">
									<div className="font-medium">Administrator</div>
									<div className="text-xs text-gray-500">School management & system admin</div>
								</div>
							</div>
						</button>

						<button onClick={() => handleRoleSelection("teacher")} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764] transition-colors">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
								<div className="text-left">
									<div className="font-medium">Teacher</div>
									<div className="text-xs text-gray-500">Class management & student progress</div>
								</div>
							</div>
						</button>

						<button onClick={() => handleRoleSelection("student")} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764] transition-colors">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center">
									<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<div className="text-left">
									<div className="font-medium">Student / Guardian</div>
									<div className="text-xs text-gray-500">Learning progress and family access</div>
								</div>
							</div>
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link href="/signup" className="font-medium text-[#037764] hover:text-[#025a4a]">
								Sign up here
							</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Login form screen
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<button onClick={handleBackToRoleSelection} className="mb-4 flex items-center text-sm text-[#037764] hover:text-[#025a4a] transition-colors">
						<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Back to role selection
					</button>

					<div className="flex items-center space-x-3 mb-4">
						<div className="w-10 h-10 bg-[#037764] rounded-full flex items-center justify-center">
							{selectedRole === "admin" && (
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
							)}
							{selectedRole === "teacher" && (
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							)}
							{selectedRole === "student" && (
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							)}
						</div>
						<div>
							<h2 className="text-2xl font-extrabold text-gray-900">Sign in as {selectedRole === "admin" ? "Administrator" : selectedRole === "teacher" ? "Teacher" : "Student/Guardian"}</h2>
							<p className="text-sm text-gray-600">{selectedRole === "admin" ? "Access school management and system administration" : selectedRole === "teacher" ? "Manage classes and track student progress" : "View learning progress and family information"}</p>
						</div>
					</div>

					<p className="text-center text-sm text-gray-600">
						Or{" "}
						<Link href="/signup" className="font-medium text-[#037764] hover:text-[#025a4a]">
							create a new account
						</Link>
					</p>
				</div>

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm -space-y-px">
						<FormInput id="email" name="email" type="email" autoComplete="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} label="Email address" />

						<FormInput id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} label="Password" />
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-[#037764] focus:ring-[#037764] border-gray-300 rounded" />
							<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
								Remember me (90 days)
							</label>
						</div>

						<div className="text-sm">
							<a href="#" className="font-medium text-[#037764] hover:text-[#025a4a]">
								Forgot your password?
							</a>
						</div>
					</div>

					<div>
						<button type="submit" disabled={isLoading} className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#037764] hover:bg-[#025a4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
