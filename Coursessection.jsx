import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../../context/Appcontext'
import CourseCard from './Coursecard' // Add this import

const CoursesSection = () => {
  const {allCourses} = useContext(AppContext)
    return (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Learn from the <span className="text-blue-600">Best Instructors</span>
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                        Discover our top-rated courses across various categories. From coding and design to business 
                        and wellness, our courses are crafted to deliver real-world results and transform your career.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">2K+</div>
                        <div className="text-gray-600">Courses Available</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-gray-600">Expert Instructors</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                        <div className="text-gray-600">Happy Students</div>
                    </div>
                </div>

                {/* Course Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                     {allCourses.slice(0,4).map((course, index) => (
                         <CourseCard key={index} course={course} />
                     ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        to={'/course-lists'} 
                        onClick={() => window.scrollTo(0, 0)}
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg group"
                    >
                        Explore All Courses
                        <svg 
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    
                    {/* Secondary Info */}
                    <p className="text-gray-500 text-sm mt-4">
                        Join 50,000+ students already learning with us
                    </p>
                </div>
            </div>
        </section>
    )
}

export default CoursesSection
