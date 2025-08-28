"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormInput from "@/components/FormInput";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

function EditLessonPlanContent() {
	const { user } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const planId = searchParams.get("plan");

	const [lessonPlan, setLessonPlan] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		subject: "",
		class: "",
		duration: "",
		objectives: [],
		materials: [],
		status: "draft",
		dateCreated: "",
		lastModified: "",
		teacher: "",
		teacherId: "",
	});
	const [errors, setErrors] = useState({});

	// Check permissions
	const hasPermission = user && (user.role === "admin" || user.role === "teacher");

	useEffect(() => {
		if (!hasPermission || !planId) {
			setIsLoading(false);
			return;
		}

		const loadLessonPlan = () => {
			try {
				const savedLessonPlans = localStorage.getItem("lessonPlans");
				if (savedLessonPlans) {
					const lessonPlans = JSON.parse(savedLessonPlans);
					const foundPlan = lessonPlans.find((plan) => plan.id.toString() === planId);

					if (foundPlan) {
						// Check if teacher can edit this lesson plan
						if (user.role === "teacher" && foundPlan.teacherId !== user.id && foundPlan.teacher !== user.name) {
							setIsLoading(false);
							return;
						}

						setLessonPlan(foundPlan);
						setFormData({
							title: foundPlan.title || "",
							subject: foundPlan.subject || "",
							class: foundPlan.class || "",
							duration: foundPlan.duration || "",
							objectives: foundPlan.objectives || [],
							materials: foundPlan.materials || [],
							status: foundPlan.status || "draft",
							dateCreated: foundPlan.dateCreated || "",
							lastModified: foundPlan.lastModified || "",
							teacher: foundPlan.teacher || "",
							teacherId: foundPlan.teacherId || "",
						});
					}
				}
			} catch (error) {
				console.error("Error loading lesson plan:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadLessonPlan();
	}, [hasPermission, planId, user]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleObjectivesChange = (e) => {
		const objectives = e.target.value
			.split("\n")
			.map((obj) => obj.trim())
			.filter((obj) => obj.length > 0);
		setFormData((prev) => ({
			...prev,
			objectives,
		}));
	};

	const handleMaterialsChange = (e) => {
		const materials = e.target.value
			.split("\n")
			.map((mat) => mat.trim())
			.filter((mat) => mat.length > 0);
		setFormData((prev) => ({
			...prev,
			materials,
		}));
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!formData.subject.trim()) {
			newErrors.subject = "Subject is required";
		}

		if (!formData.class.trim()) {
			newErrors.class = "Class is required";
		}

		if (!formData.duration.trim()) {
			newErrors.duration = "Duration is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSaving(true);

		try {
			const savedLessonPlans = localStorage.getItem("lessonPlans");
			if (savedLessonPlans) {
				const lessonPlans = JSON.parse(savedLessonPlans);
				const planIndex = lessonPlans.findIndex((plan) => plan.id.toString() === planId);

				if (planIndex !== -1) {
					// Update the lesson plan
					lessonPlans[planIndex] = {
						...lessonPlans[planIndex],
						...formData,
						lastModified: new Date().toISOString().split("T")[0],
					};

					localStorage.setItem("lessonPlans", JSON.stringify(lessonPlans));

					// Navigate back to lesson plans list
					router.push("/lesson-plans");
				}
			}
		} catch (error) {
			console.error("Error saving lesson plan:", error);
			alert("Error updating lesson plan. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	if (!hasPermission) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You don't have permission to edit lesson plans.</p>
					<button onClick={() => router.back()} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F9FEFA]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!lessonPlan) {
		return (
			<div className="min-h-screen bg-[#F9FEFA] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Plan Not Found</h1>
					<p className="text-gray-600 mb-6">The lesson plan you're looking for doesn't exist or you don't have permission to edit it.</p>
					<button onClick={() => router.push("/lesson-plans")} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Back to Lesson Plans
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<div className="flex">
				<Sidebar />

				<main className="flex-1 p-6 transition-all duration-300 md:ml-64">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4">
								<button onClick={() => router.back()} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
									</svg>
								</button>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">Edit Lesson Plan</h1>
									<p className="text-gray-600 mt-1">Update lesson plan details</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${formData.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{formData.status === "published" ? "Published" : "Draft"}</span>
							</div>
						</div>
					</div>

					{/* Form */}
					<div className="bg-white shadow-lg rounded-lg overflow-hidden">
						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							{/* Basic Information */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormInput label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} required placeholder="e.g., Introduction to Algebra" />
									<FormInput label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} required placeholder="e.g., Mathematics" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
									<FormInput label="Class" name="class" value={formData.class} onChange={handleInputChange} error={errors.class} required placeholder="e.g., Grade 8" />
									<FormInput label="Duration" name="duration" value={formData.duration} onChange={handleInputChange} error={errors.duration} required placeholder="e.g., 45 minutes" />
								</div>
							</div>

							{/* Status */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Publication Status</label>
									<select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent">
										<option value="draft">Draft</option>
										<option value="published">Published</option>
									</select>
								</div>
							</div>

							{/* Learning Objectives */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
									<textarea value={formData.objectives.join("\n")} onChange={handleObjectivesChange} rows="4" placeholder="Enter each objective on a new line..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
									<p className="text-xs text-gray-500 mt-1">Enter each objective on a separate line</p>
								</div>
							</div>

							{/* Materials */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Materials & Resources</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Required Materials</label>
									<textarea value={formData.materials.join("\n")} onChange={handleMaterialsChange} rows="4" placeholder="Enter each material on a new line..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
									<p className="text-xs text-gray-500 mt-1">Enter each material on a separate line</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end space-x-4 pt-6 border-t">
								<button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
									Cancel
								</button>
								<button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#037764] text-white rounded-lg hover:bg-[#025a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
									{isSaving ? "Saving..." : "Save Changes"}
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function EditLessonPlanPage() {
	return (
		<ProtectedRoute>
			<EditLessonPlanContent />
		</ProtectedRoute>
	);
}
