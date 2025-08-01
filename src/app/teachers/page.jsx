"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImportModal from "@/components/ImportModal";

function TeachersContent() {
	const [teachers, setTeachers] = useState([]);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if teachers data exists
		const checkTeachersData = () => {
			try {
				const savedTeachers = localStorage.getItem("teachers");
				if (savedTeachers) {
					setTeachers(JSON.parse(savedTeachers));
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
			}));

			setTeachers(processedTeachers);
			localStorage.setItem("teachers", JSON.stringify(processedTeachers));
		} catch (error) {
			console.error("Error processing teacher data:", error);
		}
	};

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
									<p className="text-[#F9FEFA] mt-1">{teachers.length} teachers employed</p>
								</div>
								<button onClick={() => setIsImportModalOpen(true)} className="bg-white text-[#037764] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#037764]/10 transition-colors">
									Import More Teachers
								</button>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher Name</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Class</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{teachers.map((teacher) => (
										<tr key={teacher.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{`${teacher.firstName} ${teacher.middleName ? teacher.middleName + " " : ""}${teacher.lastName}`}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.age} years</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.assignedClass}</td>
											<td className="px-6 py-4">
												<div className="text-sm text-gray-900">
													{teacher.subjectsTaught.length > 0 ? (
														<div className="flex flex-wrap gap-1">
															{teacher.subjectsTaught.slice(0, 3).map((subject, index) => (
																<span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#037764]/20 text-[#037764]">
																	{subject}
																</span>
															))}
															{teacher.subjectsTaught.length > 3 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">+{teacher.subjectsTaught.length - 3} more</span>}
														</div>
													) : (
														"No subjects assigned"
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.qualifications}</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">{teacher.phoneNumber}</div>
												<div className="text-sm text-gray-500">{teacher.workEmail}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString() : "N/A"}</td>
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
