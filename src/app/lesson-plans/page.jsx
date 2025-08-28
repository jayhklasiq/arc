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
	const [filterSubject, setFilterSubject] = useState("all");
	const [filterClass, setFilterClass] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [analytics, setAnalytics] = useState({
		totalLessonPlans: 0,
		subjectDistribution: {},
		classDistribution: {},
		teacherLessonPlans: 0,
		recentLessonPlans: 0,
		upcomingDeadlines: 0,
	});

	// Check if user has permission to access lesson plans
	const hasPermission = user && (user.role === "admin" || user.role === "teacher");
	const canAddLessonPlans = user && user.role === "admin";

	useEffect(() => {
		if (!hasPermission) {
			setIsLoading(false);
			return;
		}

		const loadLessonPlans = () => {
			try {
				const savedLessonPlans = localStorage.getItem("lessonPlans");
				let allLessonPlans = savedLessonPlans ? JSON.parse(savedLessonPlans) : [];

				// Add sample data if none exists (for demo purposes)
				if (allLessonPlans.length === 0) {
					allLessonPlans = [
						{
							id: 1,
							title: "Introduction to Algebra",
							subject: "Mathematics",
							class: "Grade 8",
							teacher: "John Smith",
							teacherId: "teacher1",
							dateCreated: "2024-01-15",
							lastModified: "2024-01-20",
							duration: "45 minutes",
							objectives: ["Understand basic algebraic concepts", "Solve simple equations"],
							materials: ["Whiteboard", "Calculators", "Worksheets"],
							status: "published",
						},
						{
							id: 2,
							title: "Photosynthesis Process",
							subject: "Biology",
							class: "Grade 9",
							teacher: "Sarah Johnson",
							teacherId: "teacher2",
							dateCreated: "2024-01-10",
							lastModified: "2024-01-18",
							duration: "60 minutes",
							objectives: ["Explain photosynthesis process", "Identify plant parts"],
							materials: ["Microscope", "Plant samples", "Lab worksheets"],
							status: "draft",
						},
						{
							id: 3,
							title: "World War II Overview",
							subject: "History",
							class: "Grade 10",
							teacher: "Michael Brown",
							teacherId: "teacher3",
							dateCreated: "2024-01-12",
							lastModified: "2024-01-19",
							duration: "50 minutes",
							objectives: ["Understand WWII causes", "Analyze key events"],
							materials: ["Maps", "Historical documents", "Video clips"],
							status: "published",
						},
						{
							id: 4,
							title: "Creative Writing Techniques",
							subject: "English",
							class: "Grade 7",
							teacher: "Emily Davis",
							teacherId: "teacher4",
							dateCreated: "2024-01-14",
							lastModified: "2024-01-21",
							duration: "40 minutes",
							objectives: ["Develop creative writing skills", "Use descriptive language"],
							materials: ["Writing prompts", "Example texts", "Notebooks"],
							status: "published",
						},
					];
					localStorage.setItem("lessonPlans", JSON.stringify(allLessonPlans));
				}

				// Filter lesson plans for teachers (only show their own)
				let filteredLessonPlans = allLessonPlans;
				if (user.role === "teacher") {
					filteredLessonPlans = allLessonPlans.filter((plan) => plan.teacherId === user.id || plan.teacher === user.name);
				}

				setLessonPlans(filteredLessonPlans);

				// Calculate analytics from actual data
				const subjectDistribution = {};
				const classDistribution = {};

				allLessonPlans.forEach((plan) => {
					// Subject distribution
					subjectDistribution[plan.subject] = (subjectDistribution[plan.subject] || 0) + 1;

					// Class distribution
					classDistribution[plan.class] = (classDistribution[plan.class] || 0) + 1;
				});

				// Calculate teacher-specific metrics
				const teacherLessonPlans = user.role === "teacher" ? filteredLessonPlans.length : allLessonPlans.length;

				// Recent lesson plans (created in last 7 days)
				const oneWeekAgo = new Date();
				oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
				const recentLessonPlans = allLessonPlans.filter((plan) => new Date(plan.dateCreated) >= oneWeekAgo).length;

				// Upcoming deadlines (draft lessons older than 3 days)
				const threeDaysAgo = new Date();
				threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
				const upcomingDeadlines = allLessonPlans.filter((plan) => plan.status === "draft" && new Date(plan.dateCreated) <= threeDaysAgo).length;

				setAnalytics({
					totalLessonPlans: allLessonPlans.length,
					subjectDistribution,
					classDistribution,
					teacherLessonPlans,
					recentLessonPlans,
					upcomingDeadlines,
				});
			} catch (error) {
				console.error("Error loading lesson plans:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadLessonPlans();
	}, [hasPermission, user]);

	// Filter lesson plans based on search and filters
	const filteredLessonPlans = lessonPlans.filter((plan) => {
		const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) || plan.teacher.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubject = filterSubject === "all" || plan.subject === filterSubject;
		const matchesClass = filterClass === "all" || plan.class === filterClass;

		return matchesSearch && matchesSubject && matchesClass;
	});

	// Get unique subjects and classes for filters
	const subjects = [...new Set(lessonPlans.map((plan) => plan.subject))];
	const classes = [...new Set(lessonPlans.map((plan) => plan.class))];

	if (!hasPermission) {
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
								<p className="text-gray-600 mt-1">{user.role === "admin" ? "Manage and oversee all lesson plans" : "View and edit your lesson plans"}</p>
							</div>
							{canAddLessonPlans && (
								<Link href="/lesson-plans/add" className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium">
									Add New Lesson Plan
								</Link>
							)}
						</div>
					</div>

					{/* Analytics Cards */}
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
										<dt className="text-sm font-medium text-gray-500 truncate">{user.role === "admin" ? "Total Lesson Plans" : "My Lesson Plans"}</dt>
										<dd className="text-lg font-medium text-gray-900">{analytics.teacherLessonPlans}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Subjects Covered</dt>
										<dd className="text-lg font-medium text-gray-900">{Object.keys(analytics.subjectDistribution).length}</dd>
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
										<dd className="text-lg font-medium text-gray-900">{analytics.recentLessonPlans}</dd>
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
										<dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
										<dd className="text-lg font-medium text-gray-900">{analytics.upcomingDeadlines}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					{/* Filters and Search */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
								<input type="text" placeholder="Search lesson plans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent" />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
								<select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent">
									<option value="all">All Subjects</option>
									{subjects.map((subject) => (
										<option key={subject} value={subject}>
											{subject}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
								<select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent">
									<option value="all">All Classes</option>
									{classes.map((className) => (
										<option key={className} value={className}>
											{className}
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
									}}
									className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Clear Filters
								</button>
							</div>
						</div>
					</div>

					{/* Lesson Plans List */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								{user.role === "admin" ? "All Lesson Plans" : "Your Lesson Plans"} ({filteredLessonPlans.length})
							</h3>
						</div>

						{filteredLessonPlans.length === 0 ? (
							<div className="p-8 text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans found</h3>
								<p className="mt-1 text-sm text-gray-500">{searchTerm || filterSubject !== "all" || filterClass !== "all" ? "Try adjusting your search criteria." : user.role === "admin" ? "Get started by creating your first lesson plan." : "No lesson plans have been assigned to you yet."}</p>
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
													<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{plan.status === "published" ? "Published" : "Draft"}</span>
												</div>
												<div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
													<span>{plan.subject}</span>
													<span>•</span>
													<span>{plan.class}</span>
													<span>•</span>
													<span>{plan.duration}</span>
													{user.role === "admin" && (
														<>
															<span>•</span>
															<span>By {plan.teacher}</span>
														</>
													)}
												</div>
												<div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
													<span>Created: {new Date(plan.dateCreated).toLocaleDateString()}</span>
													<span>Modified: {new Date(plan.lastModified).toLocaleDateString()}</span>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Link href={`/lesson-plans/view?id=${plan.id}`} className="text-[#037764] hover:text-[#025a4a] transition-colors p-2" title="View Lesson Plan">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</Link>
												<Link href={`/lesson-plans/edit?plan=${plan.id}`} className="text-blue-600 hover:text-blue-800 transition-colors p-2" title="Edit Lesson Plan">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
													</svg>
												</Link>
												{canAddLessonPlans && (
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
