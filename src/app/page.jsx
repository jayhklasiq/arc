'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-blue-600">School Management System</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A comprehensive solution for managing your school's administration, students, teachers, and more.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="/about"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Features</h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {[
            {
              name: 'Student Management',
              description: 'Easily manage student records, attendance, and academic progress in one place.',
              icon: '👩‍🎓'
            },
            {
              name: 'Teacher Portal',
              description: 'Empower teachers with tools for lesson planning, grading, and communication.',
              icon: '👨‍🏫'
            },
            {
              name: 'Parent Access',
              description: 'Keep parents informed about their children\'s progress and school activities.',
              icon: '👪'
            },
            {
              name: 'Attendance Tracking',
              description: 'Efficiently track and manage student and staff attendance records.',
              icon: '📋'
            },
            {
              name: 'Gradebook',
              description: 'Comprehensive grade tracking and reporting system for all classes.',
              icon: '📊'
            },
            {
              name: 'Communication',
              description: 'Seamless communication between teachers, students, and parents.',
              icon: '💬'
            }
          ].map((feature, index) => (
            <div key={index} className="pt-6
            ">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white text-xl mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 text-center">{feature.name}</h3>
                  <p className="mt-5 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 bg-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join thousands of schools that are already managing their administration with our platform.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Sign up for free
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
