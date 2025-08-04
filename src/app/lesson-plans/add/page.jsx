"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FormInput from "@/components/FormInput";

export default function AddLessonPlanPage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedClass = searchParams.get("class");

	const [formData, setFormData] = useState({
		subject: "",
		teacher: "",
		academicYear: "",
		term: "",
		description: "",
		objectives: "",
		topics: "",
		assessment: "",
		resources: "",
		notes: "",
	});

	const [selectedSubject, setSelectedSubject] = useState("");

	// Check if user is admin
	useEffect(() => {
		if (!loading && (!user || user.role !== "admin")) {
			router.push("/login");
		}
	}, [user, loading, router]);

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

	const subjects = getSubjectsForClass(selectedClass);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubjectChange = (e) => {
		setSelectedSubject(e.target.value);
		setFormData((prev) => ({
			...prev,
			subject: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically save the lesson plan to your backend
		console.log("Saving lesson plan:", { class: selectedClass, ...formData });

		// Show success message and redirect
		alert("Lesson plan created successfully!");
		router.push("/lesson-plans");
	};

	const handleCancel = () => {
		router.push("/lesson-plans");
	};

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
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Lesson Plan</h1>
							<p className="text-gray-600">Create a new syllabus for {selectedClass}</p>
						</div>
						<button onClick={handleCancel} className="text-gray-600 hover:text-gray-800 flex items-center space-x-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							<span>Back to Lesson Plans</span>
						</button>
					</div>
				</div>

				{/* Form */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Class and Subject Selection */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
								<input type="text" value={selectedClass} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
								<select name="subject" value={selectedSubject} onChange={handleSubjectChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]">
									<option value="">Select a subject</option>
									{subjects.map((subject) => (
										<option key={subject} value={subject}>
											{subject}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Teacher and Academic Year */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormInput label="Assigned Teacher *" name="teacher" value={formData.teacher} onChange={handleInputChange} required placeholder="Enter teacher's name" />
							<FormInput label="Academic Year *" name="academicYear" value={formData.academicYear} onChange={handleInputChange} required placeholder="e.g., 2024/2025" />
						</div>

						{/* Term */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Term *</label>
							<select name="term" value={formData.term} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]">
								<option value="">Select a term</option>
								<option value="First Term">First Term</option>
								<option value="Second Term">Second Term</option>
								<option value="Third Term">Third Term</option>
							</select>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
							<textarea name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="Provide a brief description of the course content and goals" />
						</div>

						{/* Learning Objectives */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives *</label>
							<textarea name="objectives" value={formData.objectives} onChange={handleInputChange} required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="List the key learning objectives for this course" />
						</div>

						{/* Topics and Content */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Topics and Content *</label>
							<textarea name="topics" value={formData.topics} onChange={handleInputChange} required rows={6} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="Outline the main topics, units, and content to be covered" />
						</div>

						{/* Assessment Methods */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Assessment Methods *</label>
							<textarea name="assessment" value={formData.assessment} onChange={handleInputChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="Describe how students will be assessed (exams, projects, assignments, etc.)" />
						</div>

						{/* Resources and Materials */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Resources and Materials</label>
							<textarea name="resources" value={formData.resources} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="List textbooks, online resources, and other materials needed" />
						</div>

						{/* Additional Notes */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
							<textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" placeholder="Any additional notes or special instructions" />
						</div>

						{/* Form Actions */}
						<div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
							<button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
								Cancel
							</button>
							<button type="submit" className="px-6 py-2 bg-[#037764] text-white rounded-md hover:bg-[#025a4a] transition-colors">
								Create Lesson Plan
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
