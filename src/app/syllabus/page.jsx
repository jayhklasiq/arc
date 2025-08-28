"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

function SyllabusContent() {
	const { user } = useAuth();
	const router = useRouter();
	const [syllabi, setSyllabi] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterSubject, setFilterSubject] = useState("all");
	const [filterTerm, setFilterTerm] = useState("all");

	// Permission checks
	const isAdmin = user?.role === "admin";
	const isTeacher = user?.role === "teacher";

	useEffect(() => {
		const loadSyllabi = () => {
			try {
				const savedSyllabi = localStorage.getItem("syllabi");
				if (savedSyllabi) {
					let parsedSyllabi = JSON.parse(savedSyllabi);

					// Filter for teachers - only show syllabi for their subjects
					if (isTeacher && user?.subjectsTaught) {
						parsedSyllabi = parsedSyllabi.filter((syllabus) => user.subjectsTaught.includes(syllabus.subject));
					}

					setSyllabi(parsedSyllabi);
				} else {
					// Generate demo data if none exists
					const demoSyllabi = generateDemoSyllabi();
					localStorage.setItem("syllabi", JSON.stringify(demoSyllabi));

					let filteredSyllabi = demoSyllabi;
					if (isTeacher && user?.subjectsTaught) {
						filteredSyllabi = demoSyllabi.filter((syllabus) => user.subjectsTaught.includes(syllabus.subject));
					}

					setSyllabi(filteredSyllabi);
				}
			} catch (error) {
				console.error("Error loading syllabi:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			loadSyllabi();
		}
	}, [user, isTeacher]);

	const generateDemoSyllabi = () => {
		const subjects = ["Mathematics", "English", "Science", "History", "Geography"];
		const terms = ["Term 1", "Term 2", "Term 3"];
		const syllabi = [];

		subjects.forEach((subject) => {
			terms.forEach((term) => {
				syllabi.push({
					id: Date.now() + Math.random(),
					subject,
					term,
					title: `${subject} Syllabus - ${term}`,
					description: `Comprehensive ${subject.toLowerCase()} curriculum for ${term.toLowerCase()}`,
					topics: [`${subject} fundamentals`, `Advanced ${subject.toLowerCase()} concepts`, `Practical applications`, `Assessment and evaluation`],
					learningOutcomes: [`Understand core ${subject.toLowerCase()} principles`, `Apply knowledge to real-world scenarios`, `Demonstrate critical thinking skills`],
					resources: [`${subject} textbook`, "Online learning materials", "Practice exercises", "Reference materials"],
					dateCreated: new Date().toISOString().split("T")[0],
					lastModified: new Date().toISOString().split("T")[0],
					createdBy: "Admin",
					status: "active",
				});
			});
		});

		return syllabi;
	};

	// Get unique subjects and terms for filtering
	const subjects = [...new Set(syllabi.map((s) => s.subject))];
	const terms = [...new Set(syllabi.map((s) => s.term))];

	// Filter syllabi based on search and filters
	const filteredSyllabi = syllabi.filter((syllabus) => {
		const matchesSearch = syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()) || syllabus.subject.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesSubject = filterSubject === "all" || syllabus.subject === filterSubject;
		const matchesTerm = filterTerm === "all" || syllabus.term === filterTerm;

		return matchesSearch && matchesSubject && matchesTerm;
	});

	const handleDeleteSyllabus = (syllabusId) => {
		if (confirm("Are you sure you want to delete this syllabus?")) {
			const updatedSyllabi = syllabi.filter((s) => s.id !== syllabusId);
			setSyllabi(updatedSyllabi);
			localStorage.setItem("syllabi", JSON.stringify(updatedSyllabi));
		}
	};

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
				<Sidebar />

				<main className="flex-1 p-6 transition-all duration-300 md:ml-64">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Syllabus Management</h1>
								<p className="text-gray-600 mt-1">{isAdmin ? "Manage and oversee all syllabi" : "View syllabi for your subjects"}</p>
							</div>
							{isAdmin && (
								<Link href="/syllabus/add" className="bg-[#037764] text-white px-6 py-2 rounded-lg hover:bg-[#025a4a] transition-colors font-medium">
									Add New Syllabus
								</Link>
							)}
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#037764] text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Total Syllabi</dt>
										<dd className="text-lg font-medium text-gray-900">{syllabi.length}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Subjects Covered</dt>
										<dd className="text-lg font-medium text-gray-900">{subjects.length}</dd>
									</dl>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
										<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">Terms Available</dt>
										<dd className="text-lg font-medium text-gray-900">{terms.length}</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					{/* Filters */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
								<input type="text" placeholder="Search syllabi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900" />
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
								<label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
								<select value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#037764] focus:border-transparent text-gray-900">
									<option value="all" className="text-gray-900">
										All Terms
									</option>
									{terms.map((term) => (
										<option key={term} value={term} className="text-gray-900">
											{term}
										</option>
									))}
								</select>
							</div>
							<div className="flex items-end">
								<button
									onClick={() => {
										setSearchTerm("");
										setFilterSubject("all");
										setFilterTerm("all");
									}}
									className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Clear Filters
								</button>
							</div>
						</div>
					</div>

					{/* Syllabi List */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<div className="px-6 py-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">
								{isAdmin ? "All Syllabi" : "Available Syllabi"} ({filteredSyllabi.length})
							</h3>
						</div>

						{filteredSyllabi.length === 0 ? (
							<div className="p-8 text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">No syllabi found</h3>
								<p className="mt-1 text-sm text-gray-500">{searchTerm || filterSubject !== "all" || filterTerm !== "all" ? "Try adjusting your search criteria." : isAdmin ? "Get started by creating your first syllabus." : "No syllabi available for your subjects yet."}</p>
								{isAdmin && (
									<div className="mt-6">
										<Link href="/syllabus/add" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#037764] hover:bg-[#025a4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#037764]">
											Add Syllabus
										</Link>
									</div>
								)}
							</div>
						) : (
							<div className="divide-y divide-gray-200">
								{filteredSyllabi.map((syllabus) => (
									<div key={syllabus.id} className="p-6 hover:bg-gray-50 transition-colors">
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center space-x-3">
													<h4 className="text-lg font-medium text-gray-900">{syllabus.title}</h4>
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{syllabus.status}</span>
												</div>
												<div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
													<span>{syllabus.subject}</span>
													<span>•</span>
													<span>{syllabus.term}</span>
													<span>•</span>
													<span>{syllabus.topics.length} topics</span>
												</div>
												<p className="mt-2 text-sm text-gray-600">{syllabus.description}</p>
												<div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
													<span>Created: {new Date(syllabus.dateCreated).toLocaleDateString()}</span>
													<span>Modified: {new Date(syllabus.lastModified).toLocaleDateString()}</span>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Link href={`/syllabus/view?id=${syllabus.id}`} className="text-[#037764] hover:text-[#025a4a] transition-colors p-2" title="View Syllabus">
													<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</Link>
												{isAdmin && (
													<>
														<Link href={`/syllabus/edit?id=${syllabus.id}`} className="text-blue-600 hover:text-blue-800 transition-colors p-2" title="Edit Syllabus">
															<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
															</svg>
														</Link>
														<button onClick={() => handleDeleteSyllabus(syllabus.id)} className="text-red-600 hover:text-red-800 transition-colors p-2" title="Delete Syllabus">
															<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
															</svg>
														</button>
													</>
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

export default function SyllabusPage() {
	return (
		<ProtectedRoute>
			<SyllabusContent />
		</ProtectedRoute>
	);
}
