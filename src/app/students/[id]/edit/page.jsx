"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import FormInput from "@/components/FormInput";
import { useAuth } from "@/contexts/AuthContext";

function EditStudentContent() {
	const router = useRouter();
	const params = useParams();
	const studentId = params.id;
	const { user } = useAuth();

	const [student, setStudent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		dateOfBirth: "",
		age: "",
		class: "",
		dateJoined: "",
		studentStatus: "active",
		exitDate: "",
		primaryGuardian: {
			firstName: "",
			middleName: "",
			lastName: "",
			phone: "",
			email: "",
			address: "",
		},
		secondaryGuardian: {
			firstName: "",
			middleName: "",
			lastName: "",
			phone: "",
			email: "",
			address: "",
		},
		address: "",
	});
	const [errors, setErrors] = useState({});

	// Check if user has permission to edit students
	const hasPermission = user && (user.role === "admin" || user.role === "teacher");

	useEffect(() => {
		const loadStudent = () => {
			try {
				const savedStudents = localStorage.getItem("students");
				if (savedStudents) {
					const students = JSON.parse(savedStudents);
					const foundStudent = students.find((s) => s.id.toString() === studentId);

					if (foundStudent) {
						setStudent(foundStudent);
						setFormData({
							firstName: foundStudent.firstName || "",
							middleName: foundStudent.middleName || "",
							lastName: foundStudent.lastName || "",
							dateOfBirth: foundStudent.dateOfBirth || "",
							age: foundStudent.age || "",
							class: foundStudent.class || "",
							dateJoined: foundStudent.dateJoined || "",
							studentStatus: foundStudent.studentStatus || "active",
							exitDate: foundStudent.exitDate || "",
							primaryGuardian: {
								firstName: foundStudent.primaryGuardian?.firstName || "",
								middleName: foundStudent.primaryGuardian?.middleName || "",
								lastName: foundStudent.primaryGuardian?.lastName || "",
								phone: foundStudent.primaryGuardian?.phone || "",
								email: foundStudent.primaryGuardian?.email || "",
								address: foundStudent.primaryGuardian?.address || "",
							},
							secondaryGuardian: {
								firstName: foundStudent.secondaryGuardian?.firstName || "",
								middleName: foundStudent.secondaryGuardian?.middleName || "",
								lastName: foundStudent.secondaryGuardian?.lastName || "",
								phone: foundStudent.secondaryGuardian?.phone || "",
								email: foundStudent.secondaryGuardian?.email || "",
								address: foundStudent.secondaryGuardian?.address || "",
							},
							address: foundStudent.address || "",
						});
					}
				}
			} catch (error) {
				console.error("Error loading student data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (studentId) {
			loadStudent();
		}
	}, [studentId]);

	const calculateAge = (dateOfBirth) => {
		if (!dateOfBirth) return "";
		const today = new Date();
		const birthDate = new Date(dateOfBirth);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		return age;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name.includes("Guardian.")) {
			const [guardianType, field] = name.split(".");
			setFormData((prev) => ({
				...prev,
				[guardianType]: {
					...prev[guardianType],
					[field]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));

			// Auto-calculate age when date of birth changes
			if (name === "dateOfBirth") {
				const age = calculateAge(value);
				setFormData((prev) => ({
					...prev,
					age: age,
				}));
			}

			// Clear exit date if status changes to active
			if (name === "studentStatus" && value === "active") {
				setFormData((prev) => ({
					...prev,
					exitDate: "",
				}));
			}
		}

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "First name is required";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "Last name is required";
		}

		if (!formData.dateOfBirth) {
			newErrors.dateOfBirth = "Date of birth is required";
		}

		if (!formData.class.trim() && formData.studentStatus === "active") {
			newErrors.class = "Class is required for active students";
		}

		if (!formData.dateJoined) {
			newErrors.dateJoined = "Date joined is required";
		}

		// Validate primary guardian
		if (!formData.primaryGuardian.firstName.trim()) {
			newErrors["primaryGuardian.firstName"] = "Primary guardian first name is required";
		}

		if (!formData.primaryGuardian.lastName.trim()) {
			newErrors["primaryGuardian.lastName"] = "Primary guardian last name is required";
		}

		if (formData.primaryGuardian.email && !/\S+@\S+\.\S+/.test(formData.primaryGuardian.email)) {
			newErrors["primaryGuardian.email"] = "Please enter a valid email address";
		}

		if (formData.secondaryGuardian.email && !/\S+@\S+\.\S+/.test(formData.secondaryGuardian.email)) {
			newErrors["secondaryGuardian.email"] = "Please enter a valid email address";
		}

		// Validate exit date if student status is not active
		if (formData.studentStatus !== "active") {
			if (!formData.exitDate.trim()) {
				const statusText = formData.studentStatus === "graduated" ? "graduation" : formData.studentStatus === "transferred" ? "transfer" : "withdrawal";
				newErrors.exitDate = `Exit date is required when student status is ${statusText}`;
			} else if (formData.dateJoined && new Date(formData.exitDate) < new Date(formData.dateJoined)) {
				newErrors.exitDate = "Exit date cannot be before enrollment date";
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
			const savedStudents = localStorage.getItem("students");
			if (savedStudents) {
				const students = JSON.parse(savedStudents);
				const studentIndex = students.findIndex((s) => s.id.toString() === studentId);

				if (studentIndex !== -1) {
					// Update the student data
					students[studentIndex] = {
						...students[studentIndex],
						...formData,
					};

					localStorage.setItem("students", JSON.stringify(students));

					// Show success message
					alert("Student profile updated successfully!");

					// Navigate back to students list
					router.push("/students");
				}
			}
		} catch (error) {
			console.error("Error saving student data:", error);
			alert("Error updating student profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this student's profile? This action cannot be undone.")) {
			try {
				const savedStudents = localStorage.getItem("students");
				if (savedStudents) {
					const students = JSON.parse(savedStudents);
					const updatedStudents = students.filter((s) => s.id.toString() !== studentId);

					localStorage.setItem("students", JSON.stringify(updatedStudents));

					alert("Student profile deleted successfully!");
					router.push("/students");
				}
			} catch (error) {
				console.error("Error deleting student:", error);
				alert("Error deleting student profile. Please try again.");
			}
		}
	};

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800";
			case "graduated":
				return "bg-blue-100 text-blue-800";
			case "transferred":
				return "bg-yellow-100 text-yellow-800";
			case "withdrawn":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusDisplayText = (status) => {
		switch (status) {
			case "active":
				return "Active Student";
			case "graduated":
				return "Graduated";
			case "transferred":
				return "Transferred";
			case "withdrawn":
				return "Withdrawn";
			default:
				return "Unknown Status";
		}
	};

	if (!hasPermission) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You don't have permission to edit student profiles.</p>
					<button onClick={() => router.back()} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!student) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h1>
					<p className="text-gray-600 mb-6">The student profile you're looking for doesn't exist.</p>
					<button onClick={() => router.push("/students")} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
						Back to Students
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
								<h1 className="text-3xl font-bold text-gray-900">Edit Student Profile</h1>
								<p className="text-gray-600 mt-1">
									Update {student.firstName} {student.lastName}'s information
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(formData.studentStatus)}`}>{getStatusDisplayText(formData.studentStatus)}</span>
							{user.role === "admin" && (
								<button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
									Delete Student
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Form */}
				<div className="bg-white shadow-lg rounded-lg overflow-hidden">
					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{/* Student Status */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Student Status</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Student Status</label>
									<select name="studentStatus" value={formData.studentStatus} onChange={handleInputChange} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-[#037764] bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400 transition-colors">
										<option value="active" className="bg-green-50 text-gray-900 font-medium py-2">
											Active (Currently Enrolled)
										</option>
										<option value="graduated" className="bg-blue-50 text-gray-900 font-medium py-2">
											Graduated
										</option>
										<option value="transferred" className="bg-yellow-50 text-gray-900 font-medium py-2">
											Transferred
										</option>
										<option value="withdrawn" className="bg-red-50 text-gray-900 font-medium py-2">
											Withdrawn
										</option>
									</select>
								</div>
								{formData.studentStatus !== "active" && (
									<div>
										<FormInput label={`${formData.studentStatus === "graduated" ? "Graduation" : formData.studentStatus === "transferred" ? "Transfer" : "Withdrawal"} Date`} name="exitDate" type="date" value={formData.exitDate} onChange={handleInputChange} error={errors.exitDate} required />
									</div>
								)}
							</div>
							{formData.studentStatus !== "active" && (
								<div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<div className="flex">
										<svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.876c1.465 0 2.637-1.168 2.637-2.611 0-.655-.273-1.286-.752-1.737L12.862 4.783a2.618 2.618 0 00-3.724 0L4.175 14.652c-.479.451-.752 1.082-.752 1.737 0 1.443 1.172 2.611 2.637 2.611z" />
										</svg>
										<div>
											<p className="text-sm text-yellow-800">
												<strong>Note:</strong> When a student is marked as {formData.studentStatus}, their class assignment will be disabled since they are no longer actively enrolled.
											</p>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Student Information */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} required />
								<FormInput label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} />
								<FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} required />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								<FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} error={errors.dateOfBirth} required />
								<FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} disabled />
								<FormInput label="Class" name="class" value={formData.class} onChange={handleInputChange} error={errors.class} placeholder="e.g., Grade 5A, Form 2B" disabled={formData.studentStatus !== "active"} required={formData.studentStatus === "active"} />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
								<FormInput label="Date Joined" name="dateJoined" type="date" value={formData.dateJoined} onChange={handleInputChange} error={errors.dateJoined} required />
								<FormInput label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Student's address" />
							</div>
						</div>

						{/* Primary Guardian */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Guardian</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormInput label="First Name" name="primaryGuardian.firstName" value={formData.primaryGuardian.firstName} onChange={handleInputChange} error={errors["primaryGuardian.firstName"]} required />
								<FormInput label="Middle Name" name="primaryGuardian.middleName" value={formData.primaryGuardian.middleName} onChange={handleInputChange} />
								<FormInput label="Last Name" name="primaryGuardian.lastName" value={formData.primaryGuardian.lastName} onChange={handleInputChange} error={errors["primaryGuardian.lastName"]} required />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								<FormInput label="Phone Number" name="primaryGuardian.phone" value={formData.primaryGuardian.phone} onChange={handleInputChange} />
								<FormInput label="Email" name="primaryGuardian.email" type="email" value={formData.primaryGuardian.email} onChange={handleInputChange} error={errors["primaryGuardian.email"]} />
								<FormInput label="Address" name="primaryGuardian.address" value={formData.primaryGuardian.address} onChange={handleInputChange} />
							</div>
						</div>

						{/* Secondary Guardian */}
						<div>
							<h2 className="text-lg font-semibold text-gray-900 mb-4">Secondary Guardian (Optional)</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormInput label="First Name" name="secondaryGuardian.firstName" value={formData.secondaryGuardian.firstName} onChange={handleInputChange} />
								<FormInput label="Middle Name" name="secondaryGuardian.middleName" value={formData.secondaryGuardian.middleName} onChange={handleInputChange} />
								<FormInput label="Last Name" name="secondaryGuardian.lastName" value={formData.secondaryGuardian.lastName} onChange={handleInputChange} />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
								<FormInput label="Phone Number" name="secondaryGuardian.phone" value={formData.secondaryGuardian.phone} onChange={handleInputChange} />
								<FormInput label="Email" name="secondaryGuardian.email" type="email" value={formData.secondaryGuardian.email} onChange={handleInputChange} error={errors["secondaryGuardian.email"]} />
								<FormInput label="Address" name="secondaryGuardian.address" value={formData.secondaryGuardian.address} onChange={handleInputChange} />
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

export default function EditStudentPage() {
	return (
		<ProtectedRoute>
			<EditStudentContent />
		</ProtectedRoute>
	);
}
