"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		} else if (!loading && user && requiredRole && user.role !== requiredRole) {
			// Redirect to appropriate dashboard based on user role
			switch (user.role) {
				case "admin":
					router.push("/admin");
					break;
				case "teacher":
					router.push("/teacher");
					break;
				case "student":
					router.push("/student");
					break;
				default:
					router.push("/login");
			}
		}
	}, [user, loading, router, requiredRole]);

	if (loading || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	// Check if user has required role (only if requiredRole is specified)
	if (requiredRole && user.role !== requiredRole) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Redirecting to your dashboard...</p>
				</div>
			</div>
		);
	}

	return children;
}
