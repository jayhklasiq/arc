"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormInput from "@/components/FormInput";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

function AddLessonPlanContent() {
	const { user } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();

	// Remove the strict class requirement - make it optional
	const selectedClass = searchParams.get("class") || "";

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [availableTeachers, setAvailableTeachers] = useState([]);
	const [formData, setFormData] = useState({
		title: "",
		subject: "",
		class: selectedClass,
		duration: "",
		objectives: [],
		materials: [],
		status: "draft",
		assignedTeacher: "", // New field for admin assignment
	});
	const [errors, setErrors] = useState({});

	// Enhanced permission checks - both admin and teacher can add lesson plans
	const isAdmin = user?.role === "admin";
	const isTeacher = user?.role === "teacher";
	const hasPermission = isAdmin || isTeacher;

	// Enhanced teacher data with comprehensive subjects including Creative Arts, Civic Education, Social Studies
	const teachersData = [
		{
			id: "teacher1",
			name: "John Smith",
			email: "john.smith@school.com",
			subjectsTaught: ["Mathematics", "Physics"],
		},
		{
			id: "teacher2",
			name: "Jane Doe",
			email: "jane.doe@school.com",
			subjectsTaught: ["English", "History", "Social Studies"],
		},
		{
			id: "teacher3",
			name: "Mike Johnson",
			email: "mike.johnson@school.com",
			subjectsTaught: ["Science", "Biology", "Chemistry"],
		},
		{
			id: "teacher4",
			name: "Sarah Wilson",
			email: "sarah.wilson@school.com",
			subjectsTaught: ["Geography", "History", "Civic Education"],
		},
		{
			id: "teacher5",
			name: "David Brown",
			email: "david.brown@school.com",
			subjectsTaught: ["Computer Science", "Mathematics"],
		},
		{
			id: "teacher6",
			name: "Emma Davis",
			email: "emma.davis@school.com",
			subjectsTaught: ["Art", "Music", "Creative Arts"],
		},
		{
			id: "teacher7",
			name: "Robert Miller",
			email: "robert.miller@school.com",
			subjectsTaught: ["Physical Education", "Health"],
		},
		{
			id: "teacher8",
			name: "Lisa Garcia",
			email: "lisa.garcia@school.com",
			subjectsTaught: ["Foreign Language", "English"],
		},
		{
			id: "teacher9",
			name: "Michael Thompson",
			email: "michael.thompson@school.com",
			subjectsTaught: ["Social Studies", "Civic Education", "Economics"],
		},
		{
			id: "teacher10",
			name: "Jennifer Adams",
			email: "jennifer.adams@school.com",
			subjectsTaught: ["Creative Arts", "Drama", "Art"],
		},
	];

	useEffect(() => {
		// Remove the strict class requirement check
		setIsLoading(false);
	}, []);

	// Update available teachers when subject changes
	useEffect(() => {
		if (formData.subject && isAdmin) {
			const teachersForSubject = teachersData.filter((teacher) => teacher.subjectsTaught.includes(formData.subject));
			setAvailableTeachers(teachersForSubject);

			// Reset assigned teacher if current selection doesn't teach the new subject
			if (formData.assignedTeacher) {
				const currentTeacher = teachersData.find((t) => t.id === formData.assignedTeacher);
				if (!currentTeacher || !currentTeacher.subjectsTaught.includes(formData.subject)) {
					setFormData((prev) => ({ ...prev, assignedTeacher: "" }));
				}
			}
		}
	}, [formData.subject, isAdmin]);

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

		if (formData.objectives.length === 0) {
			newErrors.objectives = "At least one objective is required";
		}

		if (formData.materials.length === 0) {
			newErrors.materials = "At least one material is required";
		}

		// Admin must assign to a teacher
		if (isAdmin && !formData.assignedTeacher.trim()) {
			newErrors.assignedTeacher = "Please assign this lesson plan to a teacher";
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
			let newLessonPlan;

			if (isAdmin) {
				// Admin creates and assigns to teacher
				const assignedTeacher = teachersData.find((t) => t.id === formData.assignedTeacher);

				newLessonPlan = {
					id: Date.now(),
					...formData,
					status: "approved", // Admin-created lesson plans are automatically approved
					dateCreated: new Date().toISOString().split("T")[0],
					lastModified: new Date().toISOString().split("T")[0],
					teacherId: assignedTeacher.id,
					teacher: assignedTeacher.name,
					createdBy: user.name,
					createdByRole: "admin",
					approvedDate: new Date().toISOString().split("T")[0],
					approvedBy: user.name,
					submittedDate: "",
					rejectedDate: "",
					rejectionReason: "",
				};
			} else {
				// Teacher creates their own lesson plan
				newLessonPlan = {
					id: Date.now(),
					...formData,
					status: "draft", // Teacher-created lesson plans start as draft
					dateCreated: new Date().toISOString().split("T")[0],
					lastModified: new Date().toISOString().split("T")[0],
					teacherId: user.id,
					teacher: user.name,
					createdBy: user.name,
					createdByRole: "teacher",
					submittedDate: "",
					approvedDate: "",
					rejectedDate: "",
					approvedBy: "",
					rejectionReason: "",
				};
			}

			// Remove assignedTeacher from the final object since we've used it to set teacherId
			delete newLessonPlan.assignedTeacher;

			// Save to localStorage
			const savedLessonPlans = localStorage.getItem("lessonPlans");
			const lessonPlans = savedLessonPlans ? JSON.parse(savedLessonPlans) : [];
			lessonPlans.push(newLessonPlan);
			localStorage.setItem("lessonPlans", JSON.stringify(lessonPlans));

			// Navigate back to lesson plans list
			router.push("/lesson-plans");
		} catch (error) {
			console.error("Error saving lesson plan:", error);
			alert("Error creating lesson plan. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	// Check permissions and loading states
	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
					<p className="text-gray-600 mb-6">You need to be logged in to create lesson plans.</p>
					<button onClick={() => router.push("/auth/login")} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Go to Login
					</button>
				</div>
			</div>
		);
	}

	if (!hasPermission) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You don't have permission to create lesson plans.</p>
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

	// Fixed and enhanced getAllAvailableSubjects function
	const getAllAvailableSubjects = () => {
		console.log("Teachers data:", teachersData); // Debug log

		// Get all unique subjects taught by teachers using flatMap and Set
		const teacherSubjects = [...new Set(teachersData.flatMap((teacher) => teacher.subjectsTaught))];

		console.log("Teacher subjects found:", teacherSubjects); // Debug log

		// Sort alphabetically for better UX
		const sortedSubjects = teacherSubjects.sort();

		console.log("Final sorted subjects:", sortedSubjects); // Debug log

		return sortedSubjects;
	};

	const subjectOptions = getAllAvailableSubjects();

	const classOptions = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

	const durationOptions = ["30 minutes", "45 minutes", "60 minutes", "90 minutes", "120 minutes"];

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
									<h1 className="text-3xl font-bold text-gray-900">{isAdmin ? "Create & Assign Lesson Plan" : "Create New Lesson Plan"}</h1>
									<p className="text-gray-600 mt-1">{isAdmin ? "Create a lesson plan and assign it to a teacher" : selectedClass ? `Creating lesson plan for ${selectedClass}` : "Fill in the details to create a new lesson plan"}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Debug Info - Remove this after testing */}
					{process.env.NODE_ENV === "development" && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
							<h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info (Development Only)</h3>
							<div className="text-xs text-yellow-700">
								<p>
									<strong>Total Teachers:</strong> {teachersData.length}
								</p>
								<p>
									<strong>Available Subjects:</strong> {subjectOptions.join(", ")}
								</p>
								<p>
									<strong>Total Subjects:</strong> {subjectOptions.length}
								</p>
							</div>
						</div>
					)}

					{/* Admin Assignment Info */}
					{isAdmin && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
							<div className="flex items-start">
								<div className="flex-shrink-0">
									<svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-blue-800">Admin Lesson Plan Creation</h3>
									<div className="mt-1 text-sm text-blue-700">
										<p>As an admin, lesson plans you create will be automatically approved and assigned to the selected teacher. The teacher will see this lesson plan in their dashboard.</p>
									</div>
								</div>
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
									<FormInput label="Title" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} required placeholder="e.g., Introduction to Algebra" />
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Subject <span className="text-red-500">*</span>
										</label>
										<select name="subject" value={formData.subject} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.subject ? "border-red-300" : "border-gray-300"}`} required>
											<option value="" className="text-gray-500">
												Select a subject
											</option>
											{subjectOptions.map((subject) => (
												<option key={subject} value={subject} className="text-gray-900">
													{subject}
												</option>
											))}
										</select>
										{errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
									</div>
								</div>

								{/* Teacher Assignment - Only for Admin */}
								{isAdmin && formData.subject && (
									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Assign to Teacher <span className="text-red-500">*</span>
										</label>
										<select name="assignedTeacher" value={formData.assignedTeacher} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.assignedTeacher ? "border-red-300" : "border-gray-300"}`} required>
											<option value="" className="text-gray-500">
												Select a teacher for {formData.subject}
											</option>
											{availableTeachers.map((teacher) => (
												<option key={teacher.id} value={teacher.id} className="text-gray-900">
													{teacher.name} ({teacher.email})
												</option>
											))}
										</select>
										{errors.assignedTeacher && <p className="text-red-500 text-xs mt-1">{errors.assignedTeacher}</p>}
										{availableTeachers.length === 0 && formData.subject && <p className="text-yellow-600 text-xs mt-1">No teachers found for {formData.subject}</p>}
									</div>
								)}

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Class <span className="text-red-500">*</span>
										</label>
										<select name="class" value={formData.class} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.class ? "border-red-300" : "border-gray-300"}`} required>
											<option value="" className="text-gray-500">
												Select a class
											</option>
											{classOptions.map((classOption) => (
												<option key={classOption} value={classOption} className="text-gray-900">
													{classOption}
												</option>
											))}
										</select>
										{errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Duration <span className="text-red-500">*</span>
										</label>
										<select name="duration" value={formData.duration} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.duration ? "border-red-300" : "border-gray-300"}`} required>
											<option value="" className="text-gray-500">
												Select duration
											</option>
											{durationOptions.map((duration) => (
												<option key={duration} value={duration} className="text-gray-900">
													{duration}
												</option>
											))}
										</select>
										{errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
									</div>
								</div>
							</div>

							{/* Learning Objectives */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Objectives <span className="text-red-500">*</span>
									</label>
									<textarea value={formData.objectives.join("\n")} onChange={handleObjectivesChange} rows="4" placeholder="Enter each objective on a new line..." className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.objectives ? "border-red-300" : "border-gray-300"}`} required />
									<p className="text-xs text-gray-500 mt-1">Enter each objective on a separate line</p>
									{errors.objectives && <p className="text-red-500 text-xs mt-1">{errors.objectives}</p>}
								</div>
							</div>

							{/* Materials */}
							<div>
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Materials & Resources</h2>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Required Materials <span className="text-red-500">*</span>
									</label>
									<textarea value={formData.materials.join("\n")} onChange={handleMaterialsChange} rows="4" placeholder="Enter each material on a new line..." className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900 ${errors.materials ? "border-red-300" : "border-gray-300"}`} required />
									<p className="text-xs text-gray-500 mt-1">Enter each material on a separate line</p>
									{errors.materials && <p className="text-red-500 text-xs mt-1">{errors.materials}</p>}
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex justify-end space-x-4 pt-6 border-t">
								<button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
									Cancel
								</button>
								<button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#037764] text-white rounded-lg hover:bg-[#025a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
									{isSaving ? "Creating..." : isAdmin ? "Create & Assign Lesson Plan" : "Create Lesson Plan"}
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}

export default function AddLessonPlanPage() {
	return (
		<ProtectedRoute>
			<AddLessonPlanContent />
		</ProtectedRoute>
	);
}
