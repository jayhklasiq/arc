"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ViewLessonPlansPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedClass = searchParams.get("class");

	const [lessonPlans, setLessonPlans] = useState([]);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [showPlanModal, setShowPlanModal] = useState(false);
	const [filterSubject, setFilterSubject] = useState("");

	// Check if user is admin
	useEffect(() => {
		if (!loading && (!user || user.role !== "admin")) {
			router.push("/login");
		}
	}, [user, loading, router]);

	// Mock data for lesson plans
	useEffect(() => {
		if (selectedClass) {
			// Generate mock lesson plans for the selected class
			const mockPlans = generateMockLessonPlans(selectedClass);
			setLessonPlans(mockPlans);
		}
	}, [selectedClass]);

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F9FEFA] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!user || user.role !== "admin") {
		return null;
	}

	// Generate mock lesson plans for the selected class
	function generateMockLessonPlans(className) {
		const subjects = getSubjectsForClass(className);
		return subjects.slice(0, 6).map((subject, index) => ({
			id: index + 1,
			subject,
			teacher: `Teacher ${index + 1}`,
			academicYear: "2024/2025",
			term: ["First Term", "Second Term", "Third Term"][index % 3],
			status: index % 3 === 0 ? "Active" : "Draft",
			lastUpdated: `2024-01-${10 + index}`,
			description: `This course provides a comprehensive introduction to ${subject} for ${className} students.`,
			objectives: `Students will develop a strong foundation in ${subject} concepts and practical applications.`,
			topics: `Unit 1: Introduction to ${subject}\nUnit 2: Core Concepts\nUnit 3: Practical Applications\nUnit 4: Assessment and Review`,
			assessment: "Continuous assessment through assignments, quizzes, and final examination.",
			resources: "Textbook, online resources, practical materials",
			notes: "Additional support materials available upon request.",
		}));
	}

	// Define subjects for the selected class
	const getSubjectsForClass = (className) => {
		if (className?.startsWith("Primary")) {
			return ["English Language", "Mathematics", "Integrated Science", "Social Studies", "Religious and Moral Education", "Creative Arts", "Physical Education", "French"];
		} else if (className?.startsWith("JHS")) {
			return ["English Language", "Mathematics", "Integrated Science", "Social Studies", "Religious and Moral Education", "Creative Arts and Design", "Physical Education", "French", "Computing", "Career Technology"];
		} else if (className?.startsWith("SHS")) {
			return ["Core Mathematics", "English Language", "Integrated Science", "Social Studies", "Economics", "Literature", "French", "Elective Mathematics", "Biology", "Chemistry", "Physics", "Government", "History", "Geography", "Religious Studies", "Food and Nutrition", "Management in Living", "Textiles", "Graphic Design", "Picture Making", "Ceramics", "Leatherwork", "Basketry", "Jewelry", "Music", "Dance", "Theatre Arts"];
		}
		return [];
	};

	const handleViewPlan = (plan) => {
		setSelectedPlan(plan);
		setShowPlanModal(true);
	};

	const handleEditPlan = (plan) => {
		router.push(`/lesson-plans/edit?class=${encodeURIComponent(selectedClass)}&plan=${plan.id}`);
	};

	const handleBack = () => {
		router.push("/lesson-plans");
	};

	const filteredPlans = lessonPlans.filter((plan) => !filterSubject || plan.subject.toLowerCase().includes(filterSubject.toLowerCase()));

	if (!selectedClass) {
		return (
			<div className="min-h-screen bg-[#F9FEFA]">
				<Sidebar userRole="admin" />
				<main className="p-6">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">No Class Selected</h1>
						<p className="text-gray-600 mb-6">Please select a class from the lesson plans page.</p>
						<button onClick={() => router.push("/lesson-plans")} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
							Back to Lesson Plans
						</button>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<Sidebar userRole="admin" />

			{/* Main Content */}
			<main className="p-6">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">View Lesson Plans</h1>
							<p className="text-gray-600">Browse syllabuses for {selectedClass}</p>
						</div>
						<button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center space-x-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							<span>Back to Lesson Plans</span>
						</button>
					</div>
				</div>

				{/* Filter */}
				<div className="mb-6">
					<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
						<div className="flex items-center space-x-4">
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject</label>
								<input type="text" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} placeholder="Search subjects..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" />
							</div>
							<div className="flex items-end">
								<button onClick={() => setFilterSubject("")} className="px-4 py-2 text-gray-600 hover:text-gray-800">
									Clear
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Lesson Plans Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredPlans.map((plan) => (
						<div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
							<div className="p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.subject}</h3>
										<p className="text-sm text-gray-600">{plan.teacher}</p>
									</div>
									<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${plan.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{plan.status}</span>
								</div>

								<div className="space-y-2 mb-4">
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Academic Year:</span>
										<span className="text-gray-900">{plan.academicYear}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Term:</span>
										<span className="text-gray-900">{plan.term}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-500">Last Updated:</span>
										<span className="text-gray-900">{plan.lastUpdated}</span>
									</div>
								</div>

								<p className="text-sm text-gray-600 mb-4 line-clamp-3">{plan.description}</p>

								<div className="flex space-x-2">
									<button onClick={() => handleViewPlan(plan)} className="flex-1 bg-[#037764] text-white px-3 py-2 rounded-md text-sm hover:bg-[#025a4a] transition-colors">
										View Details
									</button>
									<button onClick={() => handleEditPlan(plan)} className="flex-1 border border-[#037764] text-[#037764] px-3 py-2 rounded-md text-sm hover:bg-[#037764] hover:text-white transition-colors">
										Edit
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Empty State */}
				{filteredPlans.length === 0 && (
					<div className="text-center py-12">
						<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans found</h3>
						<p className="mt-1 text-sm text-gray-500">{filterSubject ? `No lesson plans found for "${filterSubject}"` : "No lesson plans available for this class."}</p>
						{filterSubject && (
							<button onClick={() => setFilterSubject("")} className="mt-4 bg-[#037764] text-white px-4 py-2 rounded-md text-sm hover:bg-[#025a4a] transition-colors">
								Clear Filter
							</button>
						)}
					</div>
				)}

				{/* Lesson Plan Detail Modal */}
				{showPlanModal && selectedPlan && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
							<div className="p-6 border-b border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-bold text-gray-900">{selectedPlan.subject}</h2>
										<p className="text-gray-600">
											{selectedClass} • {selectedPlan.teacher}
										</p>
									</div>
									<button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>

							<div className="p-6 space-y-6">
								{/* Basic Information */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="font-medium text-gray-900 mb-1">Academic Year</h3>
										<p className="text-gray-600">{selectedPlan.academicYear}</p>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="font-medium text-gray-900 mb-1">Term</h3>
										<p className="text-gray-600">{selectedPlan.term}</p>
									</div>
									<div className="bg-gray-50 p-4 rounded-lg">
										<h3 className="font-medium text-gray-900 mb-1">Status</h3>
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedPlan.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{selectedPlan.status}</span>
									</div>
								</div>

								{/* Description */}
								<div>
									<h3 className="font-medium text-gray-900 mb-2">Course Description</h3>
									<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.description}</p>
								</div>

								{/* Learning Objectives */}
								<div>
									<h3 className="font-medium text-gray-900 mb-2">Learning Objectives</h3>
									<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.objectives}</p>
								</div>

								{/* Topics and Content */}
								<div>
									<h3 className="font-medium text-gray-900 mb-2">Topics and Content</h3>
									<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.topics}</p>
								</div>

								{/* Assessment Methods */}
								<div>
									<h3 className="font-medium text-gray-900 mb-2">Assessment Methods</h3>
									<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.assessment}</p>
								</div>

								{/* Resources */}
								<div>
									<h3 className="font-medium text-gray-900 mb-2">Resources and Materials</h3>
									<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.resources}</p>
								</div>

								{/* Additional Notes */}
								{selectedPlan.notes && (
									<div>
										<h3 className="font-medium text-gray-900 mb-2">Additional Notes</h3>
										<p className="text-gray-600 whitespace-pre-wrap">{selectedPlan.notes}</p>
									</div>
								)}
							</div>

							<div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
								<button onClick={() => setShowPlanModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
									Close
								</button>
								<button
									onClick={() => {
										setShowPlanModal(false);
										handleEditPlan(selectedPlan);
									}}
									className="px-4 py-2 bg-[#037764] text-white rounded-md hover:bg-[#025a4a] transition-colors"
								>
									Edit Lesson Plan
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
