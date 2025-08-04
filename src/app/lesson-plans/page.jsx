"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function LessonPlansPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [selectedClass, setSelectedClass] = useState("");
	const [showClassModal, setShowClassModal] = useState(false);
	const [actionType, setActionType] = useState(""); // "add", "view", "edit"
	const [selectedSubject, setSelectedSubject] = useState("");

	// Check if user is admin
	// useEffect(() => {
	// 	if (!loading && (!user || user.role !== "admin")) {
	// 		router.push("/login");
	// 	}
	// }, [user, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F9FEFA] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	// if (!user || user.role !== "admin") {
	// 	return null;
	// }

	// Define all classes
	const allClasses = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "JHS 1", "JHS 2", "JHS 3", "SHS 1", "SHS 2", "SHS 3"];

	// Define subjects for each class level
	const getSubjectsForClass = (className) => {
		if (className.startsWith("Primary")) {
			return ["English Language", "Mathematics", "Integrated Science", "Social Studies", "Religious and Moral Education", "Creative Arts", "Physical Education", "French"];
		} else if (className.startsWith("JHS")) {
			return ["English Language", "Mathematics", "Integrated Science", "Social Studies", "Religious and Moral Education", "Creative Arts and Design", "Physical Education", "French", "Computing", "Career Technology"];
		} else if (className.startsWith("SHS")) {
			return ["Core Mathematics", "English Language", "Integrated Science", "Social Studies", "Economics", "Literature", "French", "Elective Mathematics", "Biology", "Chemistry", "Physics", "Government", "History", "Geography", "Religious Studies", "Food and Nutrition", "Management in Living", "Textiles", "Graphic Design", "Picture Making", "Ceramics", "Leatherwork", "Basketry", "Jewelry", "Music", "Dance", "Theatre Arts"];
		}
		return [];
	};

	// Handle action button clicks
	const handleActionClick = (type) => {
		setActionType(type);
		setShowClassModal(true);
	};

	// Handle class selection
	const handleClassSelect = (className) => {
		setSelectedClass(className);
		setShowClassModal(false);

		// Navigate to the appropriate page based on action type
		if (actionType === "add") {
			router.push(`/lesson-plans/add?class=${encodeURIComponent(className)}`);
		} else if (actionType === "view") {
			router.push(`/lesson-plans/view?class=${encodeURIComponent(className)}`);
		} else if (actionType === "edit") {
			router.push(`/lesson-plans/edit?class=${encodeURIComponent(className)}`);
		}
	};

	// Mock data for existing lesson plans
	const existingLessonPlans = [
		{ class: "Primary 3", subject: "Mathematics", teacher: "Mrs. Sarah Johnson", lastUpdated: "2024-01-15", status: "Active" },
		{ class: "JHS 2", subject: "Integrated Science", teacher: "Mr. David Wilson", lastUpdated: "2024-01-10", status: "Active" },
		{ class: "SHS 1", subject: "Core Mathematics", teacher: "Dr. Michael Brown", lastUpdated: "2024-01-12", status: "Active" },
		{ class: "Primary 1", subject: "English Language", teacher: "Miss Emily Davis", lastUpdated: "2024-01-08", status: "Draft" },
	];

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<Sidebar userRole="admin" />

			{/* Main Content */}
			<main className="p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Plans Management</h1>
					<p className="text-gray-600">Manage syllabuses and lesson plans for all classes and subjects</p>
				</div>

				{/* Action Buttons */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<button onClick={() => handleActionClick("add")} className="bg-[#037764] text-white p-6 rounded-lg hover:bg-[#025a4a] transition-colors flex items-center space-x-4">
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
						</svg>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Add New Syllabus</h3>
							<p className="text-sm opacity-90">Create lesson plans for a new class and subject</p>
						</div>
					</button>

					<button onClick={() => handleActionClick("view")} className="bg-white text-[#037764] border-2 border-[#037764] p-6 rounded-lg hover:bg-[#037764] hover:text-white transition-colors flex items-center space-x-4">
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<div className="text-left">
							<h3 className="text-lg font-semibold">View Lesson Plans</h3>
							<p className="text-sm opacity-90">Browse existing syllabuses and lesson plans</p>
						</div>
					</button>

					<button onClick={() => handleActionClick("edit")} className="bg-white text-[#037764] border-2 border-[#037764] p-6 rounded-lg hover:bg-[#037764] hover:text-white transition-colors flex items-center space-x-4">
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						<div className="text-left">
							<h3 className="text-lg font-semibold">Edit Lesson Plans</h3>
							<p className="text-sm opacity-90">Modify existing syllabuses and lesson plans</p>
						</div>
					</button>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Classes</p>
								<p className="text-2xl font-bold text-gray-900">{allClasses.length}</p>
							</div>
							<div className="p-3 bg-[#037764]/10 rounded-full">
								<svg className="w-6 h-6 text-[#037764]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Active Plans</p>
								<p className="text-2xl font-bold text-gray-900">{existingLessonPlans.filter((plan) => plan.status === "Active").length}</p>
							</div>
							<div className="p-3 bg-green-100 rounded-full">
								<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Draft Plans</p>
								<p className="text-2xl font-bold text-gray-900">{existingLessonPlans.filter((plan) => plan.status === "Draft").length}</p>
							</div>
							<div className="p-3 bg-yellow-100 rounded-full">
								<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Subjects</p>
								<p className="text-2xl font-bold text-gray-900">45+</p>
							</div>
							<div className="p-3 bg-blue-100 rounded-full">
								<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Lesson Plans */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Recent Lesson Plans</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{existingLessonPlans.map((plan, index) => (
									<tr key={index} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.class}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.subject}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.teacher}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.lastUpdated}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${plan.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{plan.status}</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button className="text-[#037764] hover:text-[#025a4a] mr-3">View</button>
											<button className="text-[#037764] hover:text-[#025a4a]">Edit</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Class Selection Modal */}
				{showClassModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									{actionType === "add" && "Select Class for New Syllabus"}
									{actionType === "view" && "Select Class to View"}
									{actionType === "edit" && "Select Class to Edit"}
								</h3>
								<button onClick={() => setShowClassModal(false)} className="text-gray-400 hover:text-gray-600">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							<div className="space-y-2 max-h-60 overflow-y-auto">
								{allClasses.map((className) => (
									<button key={className} onClick={() => handleClassSelect(className)} className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#037764] hover:bg-[#037764]/5 transition-colors">
										<div className="font-medium text-gray-900">{className}</div>
										<div className="text-sm text-gray-500">{getSubjectsForClass(className).length} subjects available</div>
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
