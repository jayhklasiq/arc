"use client";

import Link from "next/link";

export default function WelcomePage() {
	return (
		<div className="min-h-screen bg-[#F9FEFA]">
			{/* Hero Section */}
			<section className="py-20 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Transform Your Classroom with
						<span className="text-[#037764]"> Arc Education</span>
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">The comprehensive platform that empowers teachers to create engaging lessons, track student progress, and build meaningful connections with their students.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="#freeTrial" className="bg-[#037764] text-white px-8 py-3 rounded-lg hover:bg-[#025a4a] transition-colors font-medium text-lg">
							Start Free Trial
						</Link>
						<Link href="#features" className="border border-[#037764] text-[#037764] px-8 py-3 rounded-lg hover:bg-[#037764]/5 transition-colors font-medium text-lg">
							Learn More
						</Link>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-6 bg-white">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Excel in Teaching</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">Arc Education provides all the tools and insights you need to create an engaging and effective learning environment for your students.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Lesson Planning */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Lesson Planning</h3>
							<p className="text-gray-600 mb-4">Create engaging lesson plans with our intuitive tools. Access curriculum standards, learning objectives, and assessment strategies all in one place.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Curriculum-aligned templates</li>
								<li>• Interactive lesson builders</li>
								<li>• Resource library access</li>
							</ul>
						</div>

						{/* Student Management */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Student Progress Tracking</h3>
							<p className="text-gray-600 mb-4">Monitor individual student progress with detailed analytics and insights. Identify learning gaps and celebrate achievements in real-time.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Individual progress dashboards</li>
								<li>• Performance analytics</li>
								<li>• Personalized feedback tools</li>
							</ul>
						</div>

						{/* Assignment Management */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Assignment Management</h3>
							<p className="text-gray-600 mb-4">Create, distribute, and grade assignments efficiently. Set deadlines, provide feedback, and track completion rates seamlessly.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Digital assignment creation</li>
								<li>• Automated grading tools</li>
								<li>• Deadline management</li>
							</ul>
						</div>

						{/* Communication */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Seamless Communication</h3>
							<p className="text-gray-600 mb-4">Stay connected with students and parents through our integrated messaging system. Share updates, announcements, and progress reports instantly.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Direct messaging system</li>
								<li>• Announcement broadcasts</li>
								<li>• Parent communication portal</li>
							</ul>
						</div>

						{/* Analytics */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
							<p className="text-gray-600 mb-4">Gain insights into your teaching effectiveness with comprehensive analytics. Track class performance, identify trends, and make data-driven decisions.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Performance dashboards</li>
								<li>• Trend analysis</li>
								<li>• Custom reports</li>
							</ul>
						</div>

						{/* Collaboration */}
						<div className="bg-[#F9FEFA] rounded-xl p-8 border border-gray-200">
							<div className="w-12 h-12 bg-[#037764] rounded-lg flex items-center justify-center mb-6">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-4">Team Collaboration</h3>
							<p className="text-gray-600 mb-4">Work together with other teachers and administrators. Share resources, collaborate on lesson plans, and coordinate across grade levels.</p>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Resource sharing</li>
								<li>• Team lesson planning</li>
								<li>• Cross-grade coordination</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Why Teachers Choose Arc Education</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">Join thousands of educators who have transformed their teaching with our platform.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
										<p className="text-gray-600">Reduce administrative tasks by up to 40% with automated grading and streamlined workflows.</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">Improve Outcomes</h3>
										<p className="text-gray-600">Data-driven insights help you identify and address learning gaps more effectively.</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">Engage Students</h3>
										<p className="text-gray-600">Interactive tools and personalized learning paths keep students motivated and engaged.</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-[#037764] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Connected</h3>
										<p className="text-gray-600">Build stronger relationships with students and parents through seamless communication.</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
							<h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Ready to Get Started?</h3>
							<div className="space-y-4" id="freeTrial">
								<Link href="/signup" className="w-full bg-[#037764] text-white py-3 rounded-lg hover:bg-[#025a4a] transition-colors font-medium text-center block">
									Create Free Account
								</Link>
								<Link href="/login" className="w-full border border-[#037764] text-[#037764] py-3 rounded-lg hover:bg-[#037764]/5 transition-colors font-medium text-center block">
									Sign In
								</Link>
							</div>
							<p className="text-sm text-gray-500 text-center mt-4">No credit card required • 30-day free trial</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			{/* <footer className="bg-gray-900 text-white py-12 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="w-8 h-8 bg-[#037764] rounded-lg flex items-center justify-center">
									<span className="text-white font-bold text-lg">A</span>
								</div>
								<span className="text-xl font-semibold">Arc Education</span>
							</div>
							<p className="text-gray-400">Empowering teachers to create better learning experiences for every student.</p>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Product</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Features
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Pricing
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Integrations
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										API
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Support</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Help Center
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Contact Us
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Training
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Community
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Company</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										About
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Blog
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Careers
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Privacy
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2024 Arc Education. All rights reserved.</p>
					</div>
				</div>
			</footer> */}
		</div>
	);
}
