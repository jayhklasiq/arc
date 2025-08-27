"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function loadAttendanceRecords() {
	try {
		const raw = localStorage.getItem("attendanceRecords");
		if (!raw) {
			return { students: {}, teachers: {} };
		}
		const parsed = JSON.parse(raw);
		return {
			students: parsed.students || {},
			teachers: parsed.teachers || {},
		};
	} catch (e) {
		return { students: {}, teachers: {} };
	}
}

function saveAttendanceRecords(records) {
	localStorage.setItem("attendanceRecords", JSON.stringify(records));
}

function AttendanceContent() {
	const { user } = useAuth();
	const role = user?.role;
	const isAdmin = role === "admin";
	const isTeacher = role === "teacher";

	// Check if user has appropriate role to access attendance
	if (!isAdmin && !isTeacher) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<p className="text-gray-700">Attendance marking is available for Administrators and Teachers only.</p>
					</div>
				</div>
			</div>
		);
	}

	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [people, setPeople] = useState([]);
	const [statuses, setStatuses] = useState({}); // id -> present|absent|late
	const [isLoading, setIsLoading] = useState(true);

	// Load people list depending on role
	useEffect(() => {
		setIsLoading(true);
		try {
			if (isAdmin) {
				const teachersRaw = localStorage.getItem("teachers");
				setPeople(teachersRaw ? JSON.parse(teachersRaw) : []);
			} else if (isTeacher) {
				const studentsRaw = localStorage.getItem("students");
				setPeople(studentsRaw ? JSON.parse(studentsRaw) : []);
			}
		} catch (e) {
			setPeople([]);
		} finally {
			setIsLoading(false);
		}
	}, [isAdmin, isTeacher]);

	// Load statuses for the selected date
	useEffect(() => {
		const records = loadAttendanceRecords();
		const bucket = isAdmin ? records.teachers : records.students;
		const byDate = bucket[date] || {};
		setStatuses(byDate);
	}, [date, isAdmin]);

	const totals = useMemo(() => {
		const total = people.length;
		let present = 0;
		let absent = 0;
		let late = 0;
		for (const person of people) {
			const id = person.id;
			switch (statuses[id]) {
				case "present":
					present++;
					break;
				case "absent":
					absent++;
					break;
				case "late":
					late++;
					break;
				default:
					break;
			}
		}
		return { total, present, absent, late };
	}, [people, statuses]);

	const setAll = (value) => {
		const next = {};
		for (const p of people) next[p.id] = value;
		setStatuses(next);
	};

	const handleSave = () => {
		const records = loadAttendanceRecords();
		const key = isAdmin ? "teachers" : "students";
		const bucket = { ...(records[key] || {}) };
		bucket[date] = { ...(bucket[date] || {}), ...statuses };
		records[key] = bucket;
		saveAttendanceRecords(records);
		alert("Attendance saved.");
	};

	return (
		<div className="min-h-screen bg-[#F9FEFA] py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "Mark Teachers' Attendance" : "Mark Students' Attendance"}</h1>
							<p className="text-gray-600 mt-1">Select a date and update statuses for each {isAdmin ? "teacher" : "student"}.</p>
						</div>
						<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#037764]" />
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<p className="text-sm text-gray-600">Total</p>
						<p className="text-2xl font-semibold text-gray-900">{totals.total}</p>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<p className="text-sm text-gray-600">Present</p>
						<p className="text-2xl font-semibold text-green-700">{totals.present}</p>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
						<p className="text-sm text-gray-600">Absent</p>
						<p className="text-2xl font-semibold text-red-700">{totals.absent}</p>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-sm border border-gray-200">
					<div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
						<div className="flex gap-2">
							<button onClick={() => setAll("present")} className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
								Mark all Present
							</button>
							<button onClick={() => setAll("absent")} className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
								Mark all Absent
							</button>
							<button onClick={() => setAll("late")} className="px-3 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">
								Mark all Late
							</button>
						</div>
						<button onClick={handleSave} className="px-4 py-2 bg-[#037764] text-white rounded-md text-sm hover:bg-[#025a4a]">
							Save
						</button>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{(people || []).map((p) => {
									const displayName = isAdmin ? `${p.firstName || ""} ${p.middleName ? p.middleName + " " : ""}${p.lastName || ""}`.trim() : `${p.firstName || ""} ${p.middleName ? p.middleName + " " : ""}${p.lastName || ""}`.trim();
									const current = statuses[p.id] || "";
									return (
										<tr key={p.id} className="hover:bg-gray-50">
											<td className="px-6 py-3 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">{displayName || "Unnamed"}</div>
											</td>
											<td className="px-6 py-3 whitespace-nowrap">
												<div className="flex items-center gap-2">
													<button onClick={() => setStatuses((s) => ({ ...s, [p.id]: "present" }))} className={`px-3 py-1 rounded-md text-xs ${current === "present" ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
														Present
													</button>
													<button onClick={() => setStatuses((s) => ({ ...s, [p.id]: "absent" }))} className={`px-3 py-1 rounded-md text-xs ${current === "absent" ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"}`}>
														Absent
													</button>
													<button onClick={() => setStatuses((s) => ({ ...s, [p.id]: "late" }))} className={`px-3 py-1 rounded-md text-xs ${current === "late" ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"}`}>
														Late
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function AttendancePage() {
	return (
		<ProtectedRoute>
			<AttendanceContent />
		</ProtectedRoute>
	);
}
