import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/Appcontext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/educator/students/Footer'
import Rating from '../../components/educator/students/Rating'

const Player = () => {
  const {enrolledCourses, calculateChapterTime} = useContext(AppContext)
  const {courseId} = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [playerError, setPlayerError] = useState(false)

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if(course._id === courseId) {
        setCourseData(course)
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Proper YouTube video ID extraction
  const getVideoId = (url) => {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses])

  // Reset error when new video is selected
  useEffect(() => {
    setPlayerError(false);
  }, [playerData]);

  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* left column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          {/* Course Content Section */}
          <div className='pt-5 mb-8'>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {courseData && courseData.courseContent.map((chapter, index) => (
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
                          <img src={false ? assets.blue_tick_icon : assets.play_icon} alt="play icon" className='w-4 h-4 mt-1' />
                          <p className="flex-1">{lecture.lectureTitle}</p>
                          {lecture.lectureUrl && (
                            <p 
                              onClick={() => setPlayerData({
                                ...lecture,
                                chapter: index + 1,
                                lecture: i + 1
                              })} 
                              className='text-blue-500 cursor-pointer hover:underline mx-2'
                            >
                              watch
                            </p>
                          )}
                          <p className="text-sm text-gray-500 whitespace-nowrap">
                            {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, {units: ['h', 'm']})}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* rating*/}
        <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-xl font-bold'>
            Rate this course:
          </h1>
          <Rating initialRating={0}/>
        </div>
        </div>

        

        {/* right column */}
        <div>
          {playerData ? (
            <div className='md:mt-10'>
              {!playerError ? (
                <YouTube 
                  videoId={getVideoId(playerData.lectureUrl)} 
                  iframeClassName='w-full aspect-video rounded-lg'
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                      rel: 0,
                      modestbranding: 1,
                      origin: window.location.origin
                    },
                  }}
                  onError={(e) => {
                    console.error('YouTube player error:', e);
                    setPlayerError(true);
                  }}
                />
              ) : (
                <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-red-600 font-medium">Video unavailable</p>
                    <p className="text-gray-600 text-sm mt-2">
                      Could not load the video. Please check the URL.
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      URL: {playerData.lectureUrl}
                    </p>
                  </div>
                </div>
              )}
              
              <div className='flex justify-between items-center mt-4 p-3 bg-gray-50 rounded-lg'>
                <p className="font-medium text-gray-800">
                  {playerData.chapter}.{playerData.lecture}. {playerData.lectureTitle}
                </p>
                <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                  {false ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="sticky top-10">
              <img 
                src={courseData?.courseThumbnail} 
                alt="course thumbnail" 
                className="w-full h-auto rounded-lg shadow-md"
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-center">
                  Select a lecture to start watching
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Player
