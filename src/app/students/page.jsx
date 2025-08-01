"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImportModal from "@/components/ImportModal";

function StudentsContent() {
	const [students, setStudents] = useState([]);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if students data exists
		const checkStudentsData = () => {
			try {
				const savedStudents = localStorage.getItem("students");
				if (savedStudents) {
					setStudents(JSON.parse(savedStudents));
				}
			} catch (error) {
				console.error("Error loading students data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		checkStudentsData();
	}, []);

	const calculateAge = (dateOfBirth) => {
		const today = new Date();
		const birthDate = new Date(dateOfBirth);
		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();

		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}

		return age;
	};

	const handleImport = (data) => {
		try {
			const processedStudents = data.map((row, index) => ({
				id: Date.now() + index,
				firstName: row.student_first_name || "",
				middleName: row.student_middle_name || "",
				lastName: row.student_last_name || "",
				dateOfBirth: row.date_of_birth || "",
				age: row.date_of_birth ? calculateAge(row.date_of_birth) : "",
				class: row.class || "",
				dateJoined: row.date_joined || "",
				primaryGuardian: {
					firstName: row.primary_guardian_first_name || "",
					middleName: row.primary_guardian_middle_name || "",
					lastName: row.primary_guardian_last_name || "",
					phone: row.primary_guardian_phone || "",
					email: row.primary_guardian_email || "",
					address: row.primary_guardian_address || "",
				},
				secondaryGuardian: {
					firstName: row.secondary_guardian_first_name || "",
					middleName: row.secondary_guardian_middle_name || "",
					lastName: row.secondary_guardian_last_name || "",
					phone: row.secondary_guardian_phone || "",
					email: row.secondary_guardian_email || "",
					address: row.secondary_guardian_address || "",
				},
				address: row.primary_guardian_address || "", // Child's address matches primary guardian
			}));

			setStudents(processedStudents);
			localStorage.setItem("students", JSON.stringify(processedStudents));
		} catch (error) {
			console.error("Error processing student data:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (students.length === 0) {
		return (
			<>
				<div className="min-h-screen bg-gray-50 py-8">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<div className="mx-auto h-24 w-24 text-gray-400 mb-4">
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">No Students Found</h2>
							<p className="text-gray-600 mb-8 max-w-md mx-auto">Get started by importing your student records from a CSV or Excel file.</p>
							<button onClick={() => setIsImportModalOpen(true)} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
								</svg>
								Import Students
							</button>
						</div>
					</div>
				</div>

				<ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} type="students" />
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
									<h1 className="text-2xl font-bold text-white">Students</h1>
									<p className="text-[#F9FEFA] mt-1">{students.length} students enrolled</p>
								</div>
								<button onClick={() => setIsImportModalOpen(true)} className="bg-white text-[#037764] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#037764]/10 transition-colors">
									Import More Students
								</button>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Guardian</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{students.map((student) => (
										<tr key={student.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{`${student.firstName} ${student.middleName ? student.middleName + " " : ""}${student.lastName}`}</div>
												<div className="text-sm text-gray-500">DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.age} years</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.class}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(student.dateJoined).toLocaleDateString()}</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{`${student.primaryGuardian.firstName} ${student.primaryGuardian.middleName ? student.primaryGuardian.middleName + " " : ""}${student.primaryGuardian.lastName}`}</div>
												<div className="text-sm text-gray-500">Primary Guardian</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">{student.primaryGuardian.phone}</div>
												<div className="text-sm text-gray-500">{student.primaryGuardian.email}</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			<ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} type="students" />
		</>
	);
}

export default function StudentsPage() {
	return (
		<ProtectedRoute>
			<StudentsContent />
		</ProtectedRoute>
	);
}
