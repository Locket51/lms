import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'
import Loading from '../../components/educator/students/Loading'
import { assets } from '../../assets/assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/educator/students/Footer'
import YouTube from 'react-youtube'

const Coursedetails = () => {
  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)
  const { allCourses, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, currency } = useContext(AppContext)

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const findCourse = allCourses.find(course => course._id === id)
      setCourseData(findCourse)
    }
  }, [allCourses, id])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Calculate rating data
  const averageRating = courseData ? calculateRating(courseData) : 0;
  const reviewCount = courseData?.courseRatings?.length || courseData?.reviewCount || 0;

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
            className="w-5 h-5"
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <img 
              src={assets.star_dull_icon || assets.rating_star} 
              alt="empty star" 
              className="w-5 h-5"
            />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <img 
                src={assets.rating_star} 
                alt="half star" 
                className="w-5 h-5"
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
            className="w-5 h-5 opacity-40"
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
    
    return <span className="text-yellow-500 text-xl">{stars}</span>;
  };

  return courseData ? (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50'>
        <div className='flex md:flex-row flex-col-reverse gap-12 items-start justify-between md:px-24 px-6 md:py-24 py-12 text-left'>
          
          {/* left column */}
          <div className='max-w-2xl z-10'> 
            {/* Course Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {courseData.courseTitle}
            </h1>
            
            {/* Rating Section */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-amber-500 bg-amber-50 px-3 py-2 rounded-xl">
                  {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                </span>
                
                {/* Stars */}
                <div className="flex items-center gap-2">
                  {averageRating > 0 ? (
                    assets.rating_star ? renderStars(averageRating) : renderTextStars(averageRating)
                  ) : (
                    <span className="text-gray-400 text-lg font-medium">No ratings yet</span>
                  )}
                </div>
              </div>

              <div className="h-6 w-px bg-gray-200"></div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-600">
                <div className="text-center">
                  <p className="text-blue-600 font-semibold text-lg">
                    {courseData.courseRatings?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    {courseData.courseRatings?.length === 1 ? 'Rating' : 'Ratings'}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-emerald-600 font-semibold text-lg">
                    {courseData.enrolledStudents?.length || 0}
                  </p>
                  <p className="text-sm text-gray-500">
                    {courseData.enrolledStudents?.length === 1 ? 'Student' : 'Students'}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription || '<p class="text-gray-400 italic">No description available for this course.</p>'
                }}
              />
            </div>

            {/* Creator Info */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <p className="text-sm text-gray-500 mb-1">Created by</p>
              <p className="text-blue-600 font-semibold text-lg">Mindmosaic</p>
            </div>

            {/* Course Content Section */}
            <div className='pt-5 mb-8'>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
              {courseData?.courseContent?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {courseData.courseContent.map((chapter, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                      {/* Chapter Header */}
                      <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between" onClick={() => toggleSection(index)}>
                          <div className="flex items-center gap-3">
                            <img 
                              src={assets.down_arrow_icon} 
                              alt="arrow icon" 
                              className={`w-4 h-4 transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                            />
                            <p className="font-medium text-gray-800">{chapter.chapterTitle}</p>
                          </div>
                          <p className='text-sm text-gray-500 whitespace-nowrap'>
                            {chapter.chapterContent?.length || 0} lectures • {calculateChapterTime(chapter)}
                          </p>
                        </div>
                      </div>

                      {/* Collapsible Lectures List */}
                      <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                        <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                          {chapter.chapterContent?.map((lecture, i) => (
                            <li key={i} className='flex items-start gap-2 py-1'>
                              <img src={assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                              <p>{lecture.lectureTitle}</p>
                              {lecture.isPreviewFree && (
                                <p 
                                  onClick={() => setPlayerData({videoId: lecture.lectureUrl?.split('/').pop()})} 
                                  className='text-blue-500 cursor-pointer'
                                >
                                  Preview
                                </p>
                              )}
                              <p>{humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {units: ['h', 'm']})}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Course Description Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Description</h3>
              <div 
                className="pt-3 rich-text"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription || '<p class="text-gray-400 italic">No description available for this course.</p>'
                }}
              />
            </div>
          </div>

          {/* right column */}
          <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
               {
  playerData ? 
    <YouTube 
      videoId={playerData.videoId} 
      opts={{ playerVars: { autoplay: 1 } }} 
      iframeClassName='w-full aspect-video rounded-lg' 
    /> : 
    <img src={courseData.courseThumbnail} alt="course thumbnail" className="w-full h-auto"/>
}


            
            <div className='p-5 flex items-center gap-2'>
              <img className="w-3.5 h-3.5" src={assets.time_left_clock_icon} alt="time left clock icon"/>
              <p className='text-red-500 text-sm'><span className='font-medium'>5 days </span>left for this price</p>
            </div>
            <div className="space-y-4 p-5">
              {/* Price Section */}
              <div className='flex gap-2 items-center pt-2'>
                <p className='text-gray-800 md:text-4xl text-2xl font-bold'>
                  {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <p className='md:text-lg text-gray-500 line-through'>
                    {currency}{courseData.coursePrice}
                  </p>
                  <p className='md:text-lg font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md'>
                    {courseData.discount}% OFF
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-600'>
                <div className='flex items-center gap-2'>
                  <img src={assets.star} alt="star icon" className="w-4 h-4" />
                  <p className="font-medium">{calculateRating(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-300'></div>
                <div className='flex items-center gap-2'>
                  <img src={assets.time_clock_icon} alt="clock icon" className="w-4 h-4" />
                  <p className="font-medium">{calculateCourseDuration(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-300'></div>
                <div className='flex items-center gap-2'>
                  <img src={assets.lesson_icon} alt="lessons icon" className="w-4 h-4" />
                  <p className="font-medium">{calculateNoOfLectures(courseData)} lessons</p>
                </div>
              </div>

             

              {/* Enroll Button */}
              <button className='md:mt-6 mt-4 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 shadow-md hover:shadow-lg'>
                {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </button>

              <div className='pt-6 text-center'>
                <p className='md:text-xl text-lg font-semibold text-gray-900 mb-4'>What's in the course?</p>
                <ul className='space-y-2 text-gray-600 max-w-md mx-auto'>
                  <li className='flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    Lifetime access with free updates
                  </li>
                  <li className='flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    Step-by-step, hands-on project guidance
                  </li>
                  <li className='flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    Downloadable resources and source code
                  </li>
                  <li className='flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    Quizzes to test your knowledge
                  </li>
                  <li className='flex items-center justify-center gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  ) : (
    <Loading />
  )
}

export default Coursedetails