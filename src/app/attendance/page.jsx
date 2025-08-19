"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AttendancePage() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
	const [attendanceData, setAttendanceData] = useState({});
	const [students, setStudents] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	useEffect(() => {
		// Load data based on user role
		const loadData = () => {
			try {
				if (user?.role === "admin" || user?.name?.charAt(0)?.toUpperCase() === "A" || user?.email?.includes("admin")) {
					// Load teachers for admin
					const savedTeachers = localStorage.getItem("teachers");
					if (savedTeachers) {
						setTeachers(JSON.parse(savedTeachers));
					}
				} else {
					// Load students for teacher
					const savedStudents = localStorage.getItem("students");
					if (savedStudents) {
						setStudents(JSON.parse(savedStudents));
					}
				}

				// Load existing attendance data
				const savedAttendance = localStorage.getItem("attendance");
				if (savedAttendance) {
					setAttendanceData(JSON.parse(savedAttendance));
				}
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			loadData();
		}
	}, [user]);

	const getUserRole = () => {
		if (user?.role) return user.role;
		const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";
		if (firstLetter === "A" || user?.email?.includes("admin")) return "admin";
		if (firstLetter === "T" || user?.email?.includes("teacher")) return "teacher";
		return "teacher"; // Default to teacher for attendance page
	};

	const userRole = getUserRole();

	const handleAttendanceChange = (personId, status) => {
		const dateKey = selectedDate;
		const roleKey = userRole === "admin" ? "teachers" : "students";

		setAttendanceData((prev) => ({
			...prev,
			[dateKey]: {
				...prev[dateKey],
				[roleKey]: {
					...prev[dateKey]?.[roleKey],
					[personId]: status,
				},
			},
		}));
	};

	const saveAttendance = () => {
		try {
			localStorage.setItem("attendance", JSON.stringify(attendanceData));
			alert("Attendance saved successfully!");
		} catch (error) {
			console.error("Error saving attendance:", error);
			alert("Error saving attendance. Please try again.");
		}
	};

	const getAttendanceStatus = (personId) => {
		const dateKey = selectedDate;
		const roleKey = userRole === "admin" ? "teachers" : "students";
		return attendanceData[dateKey]?.[roleKey]?.[personId] || "unmarked";
	};

	const getAttendanceStats = () => {
		const dateKey = selectedDate;
		const roleKey = userRole === "admin" ? "teachers" : "students";
		const dayAttendance = attendanceData[dateKey]?.[roleKey] || {};
		const total = userRole === "admin" ? teachers.length : students.length;
		const present = Object.values(dayAttendance).filter((status) => status === "present").length;
		const absent = Object.values(dayAttendance).filter((status) => status === "absent").length;
		const unmarked = total - present - absent;

		return { total, present, absent, unmarked };
	};

	if (loading || isLoading) {
		return (
			<div className="min-h-screen bg-[#F9FEFA] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#037764]"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const dataList = userRole === "admin" ? teachers : students;
	const stats = getAttendanceStats();

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<Sidebar userRole={userRole} />

			<main className="p-6">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{userRole === "admin" ? "Teacher Attendance" : "Student Attendance"}
					</h1>
					<p className="text-gray-600">Mark and manage daily attendance records</p>
				</div>

				{/* Date Selection and Stats */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
						<input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764] focus:border-[#037764]" />
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Present</p>
								<p className="text-2xl font-bold text-green-600">{stats.present}</p>
							</div>
							<div className="p-3 bg-green-100 rounded-full">
								<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Absent</p>
								<p className="text-2xl font-bold text-red-600">{stats.absent}</p>
							</div>
							<div className="p-3 bg-red-100 rounded-full">
								<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Unmarked</p>
								<p className="text-2xl font-bold text-[#FED703]">{stats.unmarked}</p>
							</div>
							<div className="p-3 bg-yellow-100 rounded-full">
								<svg className="w-6 h-6 text-[#FED703]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Attendance List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200">
					<div className="p-6 border-b border-gray-200 flex justify-between items-center">
						<h2 className="text-xl font-semibold text-gray-900">
							{userRole === "admin" ? "Teachers" : "Students"} - {new Date(selectedDate).toLocaleDateString()}
						</h2>
						<button onClick={saveAttendance} className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors">
							Save Attendance
						</button>
					</div>

					{dataList.length === 0 ? (
						<div className="p-12 text-center">
							<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
							</svg>
							<h3 className="text-lg font-medium text-gray-900 mb-2">No {userRole === "admin" ? "Teachers" : "Students"} Found</h3>
							<p className="text-gray-600">
								Import {userRole === "admin" ? "teacher" : "student"} records to start marking attendance.
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
										{userRole === "admin" ? (
											<>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
											</>
										) : (
											<>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guardian</th>
											</>
										)}
										<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{dataList.map((person) => {
										const attendanceStatus = getAttendanceStatus(person.id);
										return (
											<tr key={person.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm font-medium text-gray-900">
														{userRole === "admin"
															? `${person.firstName} ${person.middleName ? person.middleName + " " : ""}${person.lastName}`
															: `${person.firstName} ${person.middleName ? person.middleName + " " : ""}${person.lastName}`}
													</div>
												</td>
												{userRole === "admin" ? (
													<>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-500">
																{person.subjectsTaught?.slice(0, 2).join(", ")}
																{person.subjectsTaught?.length > 2 && ` +${person.subjectsTaught.length - 2} more`}
															</div>
														</td>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.assignedClass}</td>
													</>
												) : (
													<>
														<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.class}</td>
														<td className="px-6 py-4 whitespace-nowrap">
															<div className="text-sm text-gray-500">
																{`${person.primaryGuardian?.firstName} ${person.primaryGuardian?.lastName}`}
															</div>
														</td>
													</>
												)}
												<td className="px-6 py-4 whitespace-nowrap text-center">
													<div className="flex justify-center space-x-2">
														<button
															onClick={() => handleAttendanceChange(person.id, "present")}
															className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
																attendanceStatus === "present" ? "bg-green-100 text-green-800 ring-2 ring-green-500" : "bg-gray-100 text-gray-600 hover:bg-green-50"
															}`}
														>
															Present
														</button>
														<button
															onClick={() => handleAttendanceChange(person.id, "absent")}
															className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
																attendanceStatus === "absent" ? "bg-red-100 text-red-800 ring-2 ring-red-500" : "bg-gray-100 text-gray-600 hover:bg-red-50"
															}`}
														>
															Absent
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}