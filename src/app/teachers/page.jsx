"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImportModal from "@/components/ImportModal";

function TeachersContent() {
	const [teachers, setTeachers] = useState([]);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all"); // all, active, inactive
	const router = useRouter();

	useEffect(() => {
		// Check if teachers data exists
		const checkTeachersData = () => {
			try {
				const savedTeachers = localStorage.getItem("teachers");
				if (savedTeachers) {
					const parsedTeachers = JSON.parse(savedTeachers);
					// Add employmentStatus if it doesn't exist (for backward compatibility)
					const updatedTeachers = parsedTeachers.map((teacher) => ({
						...teacher,
						employmentStatus: teacher.employmentStatus || "active",
						endDate: teacher.endDate || "",
					}));
					setTeachers(updatedTeachers);
					// Save updated data back to localStorage
					localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
				}
			} catch (error) {
				console.error("Error loading teachers data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkTeachersData();
	}, []);

	const handleImport = (data) => {
		try {
			const processedTeachers = data.map((row, index) => ({
				id: Date.now() + index,
				firstName: row.teacher_first_name || "",
				middleName: row.teacher_middle_name || "",
				lastName: row.teacher_last_name || "",
				age: row.age || "",
				phoneNumber: row.phone_number || "",
				workEmail: row.work_email || "",
				personalEmail: row.personal_email || "",
				qualifications: row.qualifications || "",
				hireDate: row.hire_date || "",
				assignedClass: row.assigned_class || "",
				subjectsTaught: row.subjects_taught ? row.subjects_taught.split(",").map((s) => s.trim()) : [],
				employmentStatus: row.employment_status || "active",
				endDate: row.end_date || "",
			}));

			setTeachers(processedTeachers);
			localStorage.setItem("teachers", JSON.stringify(processedTeachers));
		} catch (error) {
			console.error("Error processing teacher data:", error);
		}
	};

	const handleTeacherClick = (teacherId) => {
		router.push(`/teachers/${teacherId}/edit`);
	};

	// Filter teachers based on employment status
	const filteredTeachers = teachers.filter((teacher) => {
		if (filterStatus === "all") return true;
		if (filterStatus === "active") return teacher.employmentStatus === "active";
		if (filterStatus === "inactive") return teacher.employmentStatus === "inactive";
		return true;
	});

	const activeTeachersCount = teachers.filter((t) => t.employmentStatus === "active").length;
	const inactiveTeachersCount = teachers.filter((t) => t.employmentStatus === "inactive").length;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (teachers.length === 0) {
		return (
			<>
				<div className="min-h-screen bg-gray-50 py-8">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<div className="mx-auto h-24 w-24 text-gray-400 mb-4">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">No Teachers Found</h2>
							<p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by importing your teacher records from a CSV or Excel file.</p>
							<button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
								</svg>
								Import Teachers
							</button>
						</div>
					</div>
				</div>

				<ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} type="teachers" />
			</>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-white shadow-lg rounded-lg overflow-hidden">
						<div className="bg-[#037764] px-6 py-4">
							<div className="flex justify-between items-center">
								<div>
									<h1 className="text-2xl font-bold text-white">Teachers</h1>
									<div className="flex space-x-4 mt-1">
										<p className="text-[#F9FEFA]">{activeTeachersCount} active teachers</p>
										<p className="text-[#F9FEFA]">{inactiveTeachersCount} former teachers</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									{/* Filter Dropdown */}
									<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white text-[#037764] px-3 py-2 rounded-md text-sm font-medium border border-white/20">
										<option value="all">All Teachers ({teachers.length})</option>
										<option value="active">Active ({activeTeachersCount})</option>
										<option value="inactive">Former ({inactiveTeachersCount})</option>
									</select>
									<button onClick={() => setIsImportModalOpen(true)} className="bg-white text-[#037764] px-4 py-2 rounded-md text-sm font-medium">
										Import More Teachers
									</button>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher Name</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Class</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Period</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredTeachers.map((teacher) => (
										<tr key={teacher.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleTeacherClick(teacher.id)}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="flex-shrink-0 h-10 w-10">
														<div className={`h-10 w-10 rounded-full flex items-center justify-center ${teacher.employmentStatus === "active" ? "bg-[#037764]" : "bg-gray-400"}`}>
															<span className="text-sm font-medium text-white">
																{teacher.firstName.charAt(0)}
																{teacher.lastName.charAt(0)}
															</span>
														</div>
													</div>
													<div className="ml-4">
														<div className={`text-sm font-medium ${teacher.employmentStatus === "active" ? "text-gray-900" : "text-gray-500"}`}>{`${teacher.firstName} ${teacher.middleName ? teacher.middleName + " " : ""}${teacher.lastName}`}</div>
														<div className="text-sm text-gray-500">{teacher.workEmail}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.employmentStatus === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{teacher.employmentStatus === "active" ? "Active" : "Former"}</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.age} years</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.employmentStatus === "active" ? teacher.assignedClass : "N/A"}</td>
											<td className="px-6 py-4">
												<div className="text-sm text-gray-900">
													{teacher.subjectsTaught.length > 0 && teacher.employmentStatus === "active" ? (
														<div className="flex flex-wrap gap-1">
															{teacher.subjectsTaught.slice(0, 2).map((subject, index) => (
																<span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#037764]/20 text-[#037764]">
																	{subject}
																</span>
															))}
															{teacher.subjectsTaught.length > 2 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">+{teacher.subjectsTaught.length - 2} more</span>}
														</div>
													) : (
														<span className="text-gray-400">No subjects assigned</span>
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.qualifications}</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">{teacher.phoneNumber}</div>
												<div className="text-sm text-gray-500">{teacher.workEmail}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												<div>
													<div className="font-medium">Started: {teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString() : "N/A"}</div>
													{teacher.employmentStatus === "inactive" && teacher.endDate && <div className="text-red-600">Ended: {new Date(teacher.endDate).toLocaleDateString()}</div>}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleTeacherClick(teacher.id);
													}}
													className="text-[#037764] hover:text-[#025a4a] transition-colors"
												>
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
													</svg>
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} type="teachers" />
		</>
	);
}

export default function TeachersPage() {
	return (
		<ProtectedRoute>
			<TeachersContent />
		</ProtectedRoute>
	);
}
