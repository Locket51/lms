import React, { useContext } from 'react'
import { assets } from '../../../assets/assets/assets'
import { AppContext } from '../../../context/Appcontext.jsx'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext)
    
    // Safe calculation with null checks
    const averageRating = course ? calculateRating(course) : 0;
    const reviewCount = course?.courseRatings?.length || course?.reviewCount || 0;
    
    // Function to render stars with half and empty stars
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-0.5">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <img 
                        key={`full-${i}`} 
                        src={assets.rating_star} 
                        alt="full star" 
                        className="w-4 h-4"
                    />
                ))}
                
                {/* Half star */}
                {hasHalfStar && (
                    <div className="relative">
                        <img 
                            src={assets.star_dull_icon || assets.rating_star} 
                            alt="empty star" 
                            className="w-4 h-4"
                        />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                            <img 
                                src={assets.rating_star} 
                                alt="half star" 
                                className="w-4 h-4"
                            />
                        </div>
                    </div>
                )}
                
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <img 
                        key={`empty-${i}`} 
                        src={assets.star_dull_icon || assets.rating_star} 
                        alt="empty star" 
                        className="w-4 h-4 opacity-50"
                    />
                ))}
            </div>
        );
    };

    // Function to render text stars (fallback)
    const renderTextStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
        
        return <span className="text-yellow-400 text-lg">{stars}</span>;
    };

    // If course is undefined, return null or a loading state
    if (!course) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <Link 
            to={`/course/${course._id}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer block"
        >
            {/* Course Image */}
            <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                    src={course.courseThumbnail} 
                    alt={course.courseTitle}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Course+Image';
                    }}
                />
            </div>
            
            {/* Course Content */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {course.courseTitle}
                </h3>
                
                {/* FIXED: Check both educatorName and educator.name */}
                <p className="text-gray-600 text-sm mb-3">
                    {course.educatorName || course.educator?.name || 'Instructor'}
                </p>
                
                {/* Rating and Reviews with calculated rating */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500 font-semibold">
                        {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                    </span>
                    
                    {/* Try image stars first, fallback to text stars */}
                    {averageRating > 0 ? (
                        assets.rating_star ? renderStars(averageRating) : renderTextStars(averageRating)
                    ) : (
                        <span className="text-gray-400 text-sm">No ratings yet</span>
                    )}
                    
                    <span className="text-gray-500 text-sm">
                        ({reviewCount})
                    </span>
                </div>
                
                {/* Price Section */}
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                        {currency}{(course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)}
                    </span>
                    {course.discount > 0 && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                            {course.discount}% OFF
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard