"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

function LessonPlansContent() {
	const { user } = useAuth();
	const router = useRouter();
	const [lessonPlans, setLessonPlans] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterSubject, setFilterSubject] = useState("all");
	const [filterClass, setFilterClass] = useState("all");
	const [filterStatus, setFilterStatus] = useState("all");

	// Enhanced permission checks
	const isAdmin = user?.role === "admin";
	const isTeacher = user?.role === "teacher";
	const canAddLessonPlans = isAdmin || isTeacher; // Both can create lesson plans
	const canApprove = isAdmin; // Only admins can approve

	useEffect(() => {
		const loadLessonPlans = () => {
			try {
				const savedLessonPlans = localStorage.getItem("lessonPlans");
				if (savedLessonPlans) {
					let parsedLessonPlans = JSON.parse(savedLessonPlans);

					// Convert old status names to new ones for existing data
					parsedLessonPlans = parsedLessonPlans.map((plan) => ({
						...plan,
						status: plan.status === "published" ? "approved" : plan.status === "submitted" ? "pending" : plan.status,
					}));

					// Update localStorage with converted statuses
					localStorage.setItem("lessonPlans", JSON.stringify(parsedLessonPlans));

					// Filter for teachers - only show their own lesson plans
					if (isTeacher) {
						parsedLessonPlans = parsedLessonPlans.filter((plan) => plan.teacherId === user.id || plan.teacher === user.name);
					}

					setLessonPlans(parsedLessonPlans);
				} else {
					// Generate demo data if none exists
					const demoLessonPlans = generateDemoLessonPlans();
					localStorage.setItem("lessonPlans", JSON.stringify(demoLessonPlans));

					let filteredPlans = demoLessonPlans;
					if (isTeacher) {
						filteredPlans = demoLessonPlans.filter((plan) => plan.teacherId === user.id || plan.teacher === user.name);
					}

					setLessonPlans(filteredPlans);
				}
			} catch (error) {
				console.error("Error loading lesson plans:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			loadLessonPlans();
		}
	}, [user, isTeacher]);

	const generateDemoLessonPlans = () => {
		const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Biology"];
		const classes = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
		const statuses = ["draft", "pending", "approved", "rejected"]; // Updated status names
		const teachers = [
			{ name: "John Smith", id: "teacher1" },
			{ name: "Jane Doe", id: "teacher2" },
			{ name: "Mike Johnson", id: "teacher3" },
			{ name: "Sarah Wilson", id: "teacher4" },
			{ name: "David Brown", id: "teacher5" },
		];
		const lessonPlans = [];

		for (let i = 1; i <= 25; i++) {
			const subject = subjects[Math.floor(Math.random() * subjects.length)];
			const className = classes[Math.floor(Math.random() * classes.length)];
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			const teacher = teachers[Math.floor(Math.random() * teachers.length)];
			const dateCreated = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
			const lastModified = new Date(dateCreated.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

			const plan = {
				id: Date.now() + i,
				title: `${subject} - ${className} Lesson ${i}`,
				subject,
				class: className,
				duration: `${30 + Math.floor(Math.random() * 60)} minutes`,
				objectives: [`Understand ${subject.toLowerCase()} fundamentals`, `Apply concepts to real-world problems`, "Develop critical thinking skills", "Engage in collaborative learning"],
				materials: [`${subject} textbook`, "Whiteboard and markers", "Practice worksheets", "Online resources", "Calculator (if needed)"],
				status,
				dateCreated: dateCreated.toISOString().split("T")[0],
				lastModified: lastModified.toISOString().split("T")[0],
				teacherId: teacher.id,
				teacher: teacher.name,
			};

			// Add approval workflow fields based on status
			if (status === "pending") {
				plan.submittedDate = new Date(lastModified.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
			} else if (status === "approved") {
				plan.submittedDate = new Date(lastModified.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
				plan.approvedDate = new Date(lastModified.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
				plan.approvedBy = "Admin User";
			} else if (status === "rejected") {
				plan.submittedDate = new Date(lastModified.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
				plan.rejectedDate = new Date(lastModified.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
				plan.rejectionReason = "Needs more detailed objectives and assessment criteria.";
			}

			lessonPlans.push(plan);
		}

		return lessonPlans;
	};

	// Enhanced filter logic
	const filteredLessonPlans = lessonPlans.filter((plan) => {
		const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) || plan.teacher.toLowerCase().includes(searchTerm.toLowerCase()) || plan.class.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesSubject = filterSubject === "all" || plan.subject === filterSubject;
		const matchesClass = filterClass === "all" || plan.class === filterClass;
		const matchesStatus = filterStatus === "all" || plan.status === filterStatus;

		return matchesSearch && matchesSubject && matchesClass && matchesStatus;
	});

	// Get unique values for filters
	const subjects = [...new Set(lessonPlans.map((plan) => plan.subject))].sort();
	const classes = [...new Set(lessonPlans.map((plan) => plan.class))].sort();
	const statuses = [...new Set(lessonPlans.map((plan) => plan.status))];

	// Enhanced analytics calculations
	const analytics = {
		total: filteredLessonPlans.length,
		subjects: new Set(lessonPlans.map((plan) => plan.subject)).size,
		recent: lessonPlans.filter((plan) => new Date(plan.dateCreated) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
		pendingApproval: lessonPlans.filter((plan) => plan.status === "pending").length, // Changed from "submitted"
		draft: lessonPlans.filter((plan) => plan.status === "draft").length,
		approved: lessonPlans.filter((plan) => plan.status === "approved").length, // Changed from "published"
	};

	// Status badge helper
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
	const canEdit = (plan) => {
		if (isAdmin) return true;
		if (isTeacher) {
			return (plan.teacherId === user.id || plan.teacher === user.name) && ["draft", "rejected"].includes(plan.status);
		}
		return false;
	};

	const canDelete = (plan) => {
		if (isAdmin) return true;
		if (isTeacher) {
			return (plan.teacherId === user.id || plan.teacher === user.name) && plan.status === "draft";
		}
		return false;
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-6">You don't have permission to access lesson plans.</p>
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

	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			<div className="flex">
				<Sidebar userRole={user?.role || "teacher"} />

				<main className="flex-1 p-6 transition-all duration-300 md:ml-64">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
								<p className="text-gray-600 mt-1">{isAdmin ? "Manage and oversee all lesson plans and approvals" : "Create, edit and submit your lesson plans for approval"}</p>
							</div>
							{canAddLessonPlans && (
								<div className="flex items-center space-x-3">
									{isAdmin && analytics.pendingApproval > 0 && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{analytics.pendingApproval} pending approval</span>}
									<Link href="/lesson-plans/add" className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium">
										Add New Lesson Plan
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* Enhanced Analytics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#037764] text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">{isAdmin ? "Total Lesson Plans" : "My Lesson Plans"}</dt>
										<dd className="text-lg font-medium text-gray-900">{analytics.total}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Approved Plans</dt>
										<dd className="text-lg font-medium text-gray-900">{analytics.approved}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Recent Plans</dt>
										<dd className="text-lg font-medium text-gray-900">{analytics.recent}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.876c1.465 0 2.637-1.168 2.637-2.611 0-.655-.273-1.286-.752-1.737L12.862 4.783a2.618 2.618 0 00-3.724 0L4.175 14.652c-.479.451-.752 1.082-.752 1.737 0 1.443 1.172 2.611 2.637 2.611z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">{isAdmin ? "Pending Approval" : "Draft Plans"}</dt>
										<dd className="text-lg font-medium text-gray-900">{isAdmin ? analytics.pendingApproval : analytics.draft}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					{/* Enhanced Filters and Search */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
								<input type="text" placeholder="Search lesson plans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
								<select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900">
									<option value="all" className="text-gray-900">
										All Subjects
									</option>
									{subjects.map((subject) => (
										<option key={subject} value={subject} className="text-gray-900">
											{subject}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
								<select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900">
									<option value="all" className="text-gray-900">
										All Classes
									</option>
									{classes.map((className) => (
										<option key={className} value={className} className="text-gray-900">
											{className}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
								<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900">
									<option value="all" className="text-gray-900">
										All Statuses
									</option>
									{statuses.map((status) => (
										<option key={status} value={status} className="text-gray-900">
											{status.charAt(0).toUpperCase() + status.slice(1)}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-end">
								<button
									onClick={() => {
										setSearchTerm("");
										setFilterSubject("all");
										setFilterClass("all");
										setFilterStatus("all");
									}}
									className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Clear Filters
								</button>
							</div>
						</div>
					</div>

					{/* Enhanced Lesson Plans List */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								{isAdmin ? "All Lesson Plans" : "Your Lesson Plans"} ({filteredLessonPlans.length})
							</h3>
						</div>

						{filteredLessonPlans.length === 0 ? (
							<div className="p-8 text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans found</h3>
								<p className="mt-1 text-sm text-gray-500">{searchTerm || filterSubject !== "all" || filterClass !== "all" || filterStatus !== "all" ? "Try adjusting your search criteria." : isAdmin ? "Get started by creating your first lesson plan or wait for teacher submissions." : "Get started by creating your first lesson plan."}</p>
								{canAddLessonPlans && (
									<div className="mt-6">
										<Link href="/lesson-plans/add" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#037764] hover:bg-[#025a4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764]">
											Add Lesson Plan
										</Link>
									</div>
								)}
							</div>
						) : (
							<div className="divide-y divide-gray-200">
								{filteredLessonPlans.map((plan) => (
									<div key={plan.id} className="p-6 hover:bg-gray-50 transition-colors">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3">
													<h4 className="text-lg font-medium text-gray-900">{plan.title}</h4>
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(plan.status)}`}>{plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}</span>
												</div>
												<div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
													<span>{plan.subject}</span>
													<span>•</span>
													<span>{plan.class}</span>
													<span>•</span>
													<span>{plan.duration}</span>
													{isAdmin && (
														<>
															<span>•</span>
															<span>By {plan.teacher}</span>
														</>
													)}
												</div>
												<div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
													<span>Created: {new Date(plan.dateCreated).toLocaleDateString()}</span>
													<span>Modified: {new Date(plan.lastModified).toLocaleDateString()}</span>
													{plan.submittedDate && <span>Submitted: {new Date(plan.submittedDate).toLocaleDateString()}</span>}
													{plan.approvedDate && <span>Approved: {new Date(plan.approvedDate).toLocaleDateString()}</span>}
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Link href={`/lesson-plans/view?id=${plan.id}`} className="text-[#037764] hover:text-[#025a4a] transition-colors p-2" title="View Lesson Plan">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</Link>
												{canEdit(plan) && (
													<Link href={`/lesson-plans/edit?plan=${plan.id}`} className="text-blue-600 hover:text-blue-800 transition-colors p-2" title="Edit Lesson Plan">
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
													</Link>
												)}
												{canDelete(plan) && (
													<button
														onClick={() => {
															if (window.confirm("Are you sure you want to delete this lesson plan?")) {
																const updatedPlans = lessonPlans.filter((p) => p.id !== plan.id);
																setLessonPlans(updatedPlans);
																localStorage.setItem("lessonPlans", JSON.stringify(updatedPlans));
															}
														}}
														className="text-red-600 hover:text-red-800 transition-colors p-2"
														title="Delete Lesson Plan"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
														</svg>
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default function LessonPlansPage() {
	return (
		<ProtectedRoute>
			<LessonPlansContent />
		</ProtectedRoute>
	);
}
