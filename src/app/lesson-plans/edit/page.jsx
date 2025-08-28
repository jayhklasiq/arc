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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
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
		submittedDate: "",
		approvedDate: "",
		rejectedDate: "",
		approvedBy: "",
		rejectionReason: "",
	});
	const [errors, setErrors] = useState({});

	// Check permissions
	const hasPermission = user && (user.role === "admin" || user.role === "teacher");
	const isAdmin = user?.role === "admin";
	const isTeacher = user?.role === "teacher";

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
						if (isTeacher && foundPlan.teacherId !== user.id && foundPlan.teacher !== user.name) {
							setIsLoading(false);
							return;
						}

						// Convert old status names to new ones
						let status = foundPlan.status;
						if (status === "published") status = "approved";
						if (status === "submitted") status = "pending";

						setLessonPlan(foundPlan);
						setFormData({
							title: foundPlan.title || "",
							subject: foundPlan.subject || "",
							class: foundPlan.class || "",
							duration: foundPlan.duration || "",
							objectives: foundPlan.objectives || [],
							materials: foundPlan.materials || [],
							status: status,
							dateCreated: foundPlan.dateCreated || "",
							lastModified: foundPlan.lastModified || "",
							teacher: foundPlan.teacher || "",
							teacherId: foundPlan.teacherId || "",
							submittedDate: foundPlan.submittedDate || "",
							approvedDate: foundPlan.approvedDate || "",
							rejectedDate: foundPlan.rejectedDate || "",
							approvedBy: foundPlan.approvedBy || "",
							rejectionReason: foundPlan.rejectionReason || "",
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
	}, [hasPermission, planId, user, isTeacher]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

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

	const updateLessonPlan = (updatedData) => {
		try {
			const savedLessonPlans = localStorage.getItem("lessonPlans");
			if (savedLessonPlans) {
				const lessonPlans = JSON.parse(savedLessonPlans);
				const planIndex = lessonPlans.findIndex((plan) => plan.id.toString() === planId);

				if (planIndex !== -1) {
					lessonPlans[planIndex] = {
						...lessonPlans[planIndex],
						...updatedData,
						lastModified: new Date().toISOString().split("T")[0],
					};

					localStorage.setItem("lessonPlans", JSON.stringify(lessonPlans));
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error("Error updating lesson plan:", error);
			return false;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSaving(true);

		try {
			const success = updateLessonPlan(formData);
			if (success) {
				router.push("/lesson-plans");
			} else {
				alert("Error updating lesson plan. Please try again.");
			}
		} catch (error) {
			console.error("Error saving lesson plan:", error);
			alert("Error updating lesson plan. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleSubmitForApproval = async () => {
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const updatedData = {
				...formData,
				status: "pending", // Changed from "submitted" to "pending"
				submittedDate: new Date().toISOString().split("T")[0],
			};

			const success = updateLessonPlan(updatedData);
			if (success) {
				alert("Lesson plan submitted for approval successfully!");
				router.push("/lesson-plans");
			} else {
				alert("Error submitting lesson plan. Please try again.");
			}
		} catch (error) {
			console.error("Error submitting lesson plan:", error);
			alert("Error submitting lesson plan. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleApprove = async () => {
		try {
			const updatedData = {
				...formData,
				status: "approved", // Changed from "published" to "approved"
				approvedDate: new Date().toISOString().split("T")[0],
				approvedBy: user.name,
			};

			const success = updateLessonPlan(updatedData);
			if (success) {
				alert("Lesson plan approved successfully!");
				router.push("/lesson-plans");
			} else {
				alert("Error approving lesson plan. Please try again.");
			}
		} catch (error) {
			console.error("Error approving lesson plan:", error);
			alert("Error approving lesson plan. Please try again.");
		}
	};

	const handleReject = async () => {
		if (!rejectionReason.trim()) {
			alert("Please provide a reason for rejection.");
			return;
		}

		try {
			const updatedData = {
				...formData,
				status: "rejected",
				rejectedDate: new Date().toISOString().split("T")[0],
				rejectionReason: rejectionReason.trim(),
			};

			const success = updateLessonPlan(updatedData);
			if (success) {
				alert("Lesson plan rejected.");
				setShowRejectModal(false);
				router.push("/lesson-plans");
			} else {
				alert("Error rejecting lesson plan. Please try again.");
			}
		} catch (error) {
			console.error("Error rejecting lesson plan:", error);
			alert("Error rejecting lesson plan. Please try again.");
		}
	};

	// Helper to get status badge color
	const getStatusBadge = (status) => {
		const badges = {
			draft: "bg-gray-100 text-gray-800",
			pending: "bg-blue-100 text-blue-800", // Changed from "submitted"
			approved: "bg-green-100 text-green-800", // Changed from "published"
			rejected: "bg-red-100 text-red-800",
		};
		return badges[status] || "bg-gray-100 text-gray-800";
	};

	// Permission checks for actions
	const canEdit = () => {
		if (isAdmin) return true;
		if (isTeacher) {
			return (lessonPlan?.teacherId === user.id || lessonPlan?.teacher === user.name) && ["draft", "rejected"].includes(lessonPlan?.status);
		}
		return false;
	};

	const canSubmit = () => {
		return isTeacher && (lessonPlan?.teacherId === user.id || lessonPlan?.teacher === user.name) && lessonPlan?.status === "draft";
	};

	const canApprove = () => {
		return isAdmin && lessonPlan?.status === "pending"; // Changed from "submitted"
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
									<h1 className="text-3xl font-bold text-gray-900">{isAdmin ? "Review Lesson Plan" : "Edit Lesson Plan"}</h1>
									<p className="text-gray-600 mt-1">{isAdmin ? "Review and approve/reject lesson plan" : "Update lesson plan details"}</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(formData.status)}`}>{formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}</span>
							</div>
						</div>
					</div>

					{/* Status Information */}
					{(formData.submittedDate || formData.approvedDate || formData.rejectedDate) && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
							<h3 className="text-sm font-medium text-blue-800 mb-2">Status History</h3>
							<div className="space-y-1 text-sm text-blue-700">
								{formData.submittedDate && <p>Submitted for approval on {new Date(formData.submittedDate).toLocaleDateString()}</p>}
								{formData.approvedDate && (
									<p>
										Approved by {formData.approvedBy} on {new Date(formData.approvedDate).toLocaleDateString()}
									</p>
								)}
								{formData.rejectedDate && <p>Rejected on {new Date(formData.rejectedDate).toLocaleDateString()}</p>}
								{formData.rejectionReason && <p className="font-medium">Reason: {formData.rejectionReason}</p>}
							</div>
						</div>
					)}

					{/* Admin Approval Actions */}
					{canApprove() && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
							<h3 className="text-sm font-medium text-yellow-800 mb-3">Pending Approval</h3>
							<p className="text-sm text-yellow-700 mb-4">This lesson plan is waiting for your approval.</p>
							<div className="flex space-x-3">
								<button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
									✅ Approve
								</button>
								<button onClick={() => setShowRejectModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
									❌ Reject
								</button>
							</div>
						</div>
					)}

					{/* Form */}
					<div className="bg-white shadow-lg rounded-lg overflow-hidden">
						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							{/* Basic Information */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormInput label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} required placeholder="e.g., Introduction to Algebra" disabled={!canEdit()} />
									<FormInput label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} error={errors.subject} required placeholder="e.g., Mathematics" disabled={!canEdit()} />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
									<FormInput label="Class" name="class" value={formData.class} onChange={handleInputChange} error={errors.class} required placeholder="e.g., Grade 8" disabled={!canEdit()} />
									<FormInput label="Duration" name="duration" value={formData.duration} onChange={handleInputChange} error={errors.duration} required placeholder="e.g., 45 minutes" disabled={!canEdit()} />
								</div>
							</div>

							{/* Learning Objectives */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
									<textarea value={formData.objectives.join("\n")} onChange={handleObjectivesChange} rows="4" placeholder="Enter each objective on a new line..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900" disabled={!canEdit()} />
									<p className="text-xs text-gray-500 mt-1">Enter each objective on a separate line</p>
								</div>
							</div>

							{/* Materials */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Materials & Resources</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Required Materials</label>
									<textarea value={formData.materials.join("\n")} onChange={handleMaterialsChange} rows="4" placeholder="Enter each material on a new line..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900" disabled={!canEdit()} />
									<p className="text-xs text-gray-500 mt-1">Enter each material on a separate line</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-between pt-6 border-t">
								<button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
									Back
								</button>

								<div className="flex space-x-4">
									{canEdit() && (
										<button type="submit" disabled={isSaving} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
											{isSaving ? "Saving..." : "Save Changes"}
										</button>
									)}

									{canSubmit() && (
										<button type="button" onClick={handleSubmitForApproval} disabled={isSubmitting} className="px-6 py-2 bg-[#037764] text-white rounded-lg hover:bg-[#025a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
											{isSubmitting ? "Submitting..." : "Submit for Approval"}
										</button>
									)}
								</div>
							</div>
						</form>
					</div>
				</main>
			</div>

			{/* Rejection Modal */}
			{showRejectModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Reject Lesson Plan</h3>
						<p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this lesson plan:</p>
						<textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows="4" placeholder="Enter rejection reason..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900" />
						<div className="flex justify-end space-x-3 mt-6">
							<button
								onClick={() => {
									setShowRejectModal(false);
									setRejectionReason("");
								}}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
								Reject
							</button>
						</div>
					</div>
				</div>
			)}
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
