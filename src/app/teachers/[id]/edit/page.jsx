"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormInput from "@/components/FormInput";

function EditTeacherContent() {
	const router = useRouter();
	const params = useParams();
	const teacherId = params.id;

	const [teacher, setTeacher] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		age: "",
		phoneNumber: "",
		workEmail: "",
		personalEmail: "",
		qualifications: "",
		hireDate: "",
		assignedClass: "",
		subjectsTaught: [],
		employmentStatus: "active",
		endDate: "",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const loadTeacher = () => {
			try {
				const savedTeachers = localStorage.getItem("teachers");
				if (savedTeachers) {
					const teachers = JSON.parse(savedTeachers);
					const foundTeacher = teachers.find((t) => t.id.toString() === teacherId);

					if (foundTeacher) {
						setTeacher(foundTeacher);
						setFormData({
							firstName: foundTeacher.firstName || "",
							middleName: foundTeacher.middleName || "",
							lastName: foundTeacher.lastName || "",
							age: foundTeacher.age || "",
							phoneNumber: foundTeacher.phoneNumber || "",
							workEmail: foundTeacher.workEmail || "",
							personalEmail: foundTeacher.personalEmail || "",
							qualifications: foundTeacher.qualifications || "",
							hireDate: foundTeacher.hireDate || "",
							assignedClass: foundTeacher.assignedClass || "",
							subjectsTaught: foundTeacher.subjectsTaught || [],
							employmentStatus: foundTeacher.employmentStatus || "active",
							endDate: foundTeacher.endDate || "",
						});
					}
				}
			} catch (error) {
				console.error("Error loading teacher data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (teacherId) {
			loadTeacher();
		}
	}, [teacherId]);

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

		// Clear end date and subjects/class if employment status is changed to active
		if (name === "employmentStatus" && value === "active") {
			setFormData((prev) => ({
				...prev,
				endDate: "",
			}));
		}
	};

	const handleSubjectsChange = (e) => {
		const subjects = e.target.value
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		setFormData((prev) => ({
			...prev,
			subjectsTaught: subjects,
		}));
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.workEmail.trim()) {
			newErrors.workEmail = "Work email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
			newErrors.workEmail = "Please enter a valid email address";
		}

		if (formData.personalEmail && !/\S+@\S+\.\S+/.test(formData.personalEmail)) {
			newErrors.personalEmail = "Please enter a valid email address";
		}

		if (formData.age && (isNaN(formData.age) || formData.age < 18 || formData.age > 100)) {
			newErrors.age = "Please enter a valid age between 18 and 100";
		}

		// Validate end date if employment status is not active
		if (formData.employmentStatus !== "active") {
			if (!formData.endDate.trim()) {
				const statusText = formData.employmentStatus === "retired" ? "retirement" : "resignation";
				newErrors.endDate = `End date is required when employment status is ${statusText}`;
			} else if (formData.hireDate && new Date(formData.endDate) < new Date(formData.hireDate)) {
				newErrors.endDate = "End date cannot be before hire date";
			}
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
			const savedTeachers = localStorage.getItem("teachers");
			if (savedTeachers) {
				const teachers = JSON.parse(savedTeachers);
				const teacherIndex = teachers.findIndex((t) => t.id.toString() === teacherId);

				if (teacherIndex !== -1) {
					// Update the teacher data
					teachers[teacherIndex] = {
						...teachers[teacherIndex],
						...formData,
					};

					localStorage.setItem("teachers", JSON.stringify(teachers));

					// Show success message (you could add a toast notification here)
					alert("Teacher profile updated successfully!");

					// Navigate back to teachers list
					router.push("/teachers");
				}
			}
		} catch (error) {
			console.error("Error saving teacher data:", error);
			alert("Error updating teacher profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this teacher's profile? This action cannot be undone.")) {
			try {
				const savedTeachers = localStorage.getItem("teachers");
				if (savedTeachers) {
					const teachers = JSON.parse(savedTeachers);
					const updatedTeachers = teachers.filter((t) => t.id.toString() !== teacherId);

					localStorage.setItem("teachers", JSON.stringify(updatedTeachers));

					alert("Teacher profile deleted successfully!");
					router.push("/teachers");
				}
			} catch (error) {
				console.error("Error deleting teacher:", error);
				alert("Error deleting teacher profile. Please try again.");
			}
		}
	};

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "retired":
				return "bg-blue-100 text-blue-800";
			case "resigned":
				return "bg-orange-100 text-orange-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusDisplayText = (status) => {
		switch (status) {
			case "active":
				return "Active Employee";
			case "retired":
				return "Retired";
			case "resigned":
				return "Resigned";
			default:
				return "Unknown Status";
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!teacher) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h1>
					<p className="text-gray-600 mb-6">The teacher profile you're looking for doesn't exist.</p>
					<button onClick={() => router.push("/teachers")} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Back to Teachers
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
								<h1 className="text-3xl font-bold text-gray-900">Edit Teacher Profile</h1>
								<p className="text-gray-600 mt-1">
									Update {teacher.firstName} {teacher.lastName}'s information
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(formData.employmentStatus)}`}>{getStatusDisplayText(formData.employmentStatus)}</span>
							<button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
								Delete Teacher
							</button>
						</div>
					</div>
				</div>

				{/* Form */}
				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{/* Employment Status */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Status</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
									<select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-[#037764] bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors">
										<option value="active" className="bg-green-50 text-gray-900font-medium py-2">
											Active (Currently Employed)
										</option>
										<option value="retired" className="bg-blue-50 text-gray-900font-medium py-2">
											Retired
										</option>
										<option value="resigned" className="bg-orange-50 text-gray-900 font-medium py-2">
											Resigned
										</option>
									</select>
								</div>
								{formData.employmentStatus !== "active" && (
									<div>
										<FormInput label={`${formData.employmentStatus === "retired" ? "Retirement" : "Resignation"} Date`} name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} error={errors.endDate} required />
									</div>
								)}
							</div>
							{formData.employmentStatus !== "active" && (
								<div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<div className="flex">
										<svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.876c1.465 0 2.637-1.168 2.637-2.611 0-.655-.273-1.286-.752-1.737L12.862 4.783a2.618 2.618 0 00-3.724 0L4.175 14.652c-.479.451-.752 1.082-.752 1.737 0 1.443 1.172 2.611 2.637 2.611z" />
										</svg>
										<div>
											<p className="text-sm text-yellow-800">
												<strong>Note:</strong> When a teacher is marked as {formData.employmentStatus}, their assigned class and subjects will be disabled since they are no longer actively teaching.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Personal Information */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} required />
								<FormInput label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} />
								<FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} required />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								<FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} error={errors.age} min="18" max="100" />
								<FormInput label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
							</div>
						</div>

						{/* Contact Information */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormInput label="Work Email" name="workEmail" type="email" value={formData.workEmail} onChange={handleInputChange} error={errors.workEmail} required />
								<FormInput label="Personal Email" name="personalEmail" type="email" value={formData.personalEmail} onChange={handleInputChange} error={errors.personalEmail} />
							</div>
						</div>

						{/* Professional Information */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormInput label="Qualifications" name="qualifications" value={formData.qualifications} onChange={handleInputChange} placeholder="e.g., B.Ed, M.A. in Mathematics" />
								<FormInput label="Hire Date" name="hireDate" type="date" value={formData.hireDate} onChange={handleInputChange} />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								<FormInput label="Assigned Class" name="assignedClass" value={formData.assignedClass} onChange={handleInputChange} placeholder="e.g., Class 5A, Form 2B" disabled={formData.employmentStatus !== "active"} />
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Subjects Taught</label>
									<input type="text" value={formData.subjectsTaught.join(", ")} onChange={handleSubjectsChange} placeholder="e.g., Mathematics, Science, English" disabled={formData.employmentStatus !== "active"} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500" />
									<p className="text-xs text-gray-500 mt-1">{formData.employmentStatus !== "active" ? `Subjects are not applicable for ${formData.employmentStatus} teachers` : "Separate subjects with commas"}</p>
								</div>
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
			</div>
		</div>
	);
}

export default function EditTeacherPage() {
	return (
		<ProtectedRoute>
			<EditTeacherContent />
		</ProtectedRoute>
	);
}
