import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/Appcontext'
import SearchBar from '../../components/educator/students/Searchbar'
import { useParams, useNavigate } from 'react-router-dom'
import CourseCard from '../../components/educator/students/Coursecard'
import { assets } from '../../assets/assets/assets'
import Footer from '../../components/educator/students/Footer'

const CoursesList = () => {
  const { allCourses } = useContext(AppContext)
  const { input } = useParams()
  const navigate = useNavigate()
  const [filteredCourse, setFilteredCourse] = useState([])

  useEffect(() => {
    if(allCourses && allCourses.length > 0){
      const tempCourses = allCourses.slice()
      
      input ?
      setFilteredCourse(
        tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      : setFilteredCourse(tempCourses)
    }
  }, [allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span 
                className='text-blue-600 cursor-pointer'
                onClick={() => navigate('/')}
              >
                Home
              </span> / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input}/>
        </div>
        
        {/* Filter tag */}
        {input && (
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
            <p>{input}</p>
            <img 
              src={assets.cross_icon} 
              alt="Clear search" 
              className='cursor-pointer w-4 h-4' 
              onClick={() => navigate('/course-lists')} // Fixed: course-lists (with 's')
            />
          </div>
        )}
        
        {/* Courses grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0'>
          {filteredCourse.map((course, index) => 
            <CourseCard key={index} course={course} />
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CoursesList
