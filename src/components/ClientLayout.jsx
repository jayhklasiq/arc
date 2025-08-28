"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import Header from "./Header";

export default function ClientLayout({ children }) {
	return (
		<AuthProvider>
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-grow">{children}</main>
				<footer className="bg-white border-t border-gray-200 mt-8">
					<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
						<p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} Arc Education. All rights reserved.</p>
					</div>
				</footer>
			</div>
		</AuthProvider>
	);
}
