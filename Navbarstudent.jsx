import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../../assets/assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../../context/Appcontext';

const Navbarstudent = () => {
  const location = useLocation()
  const {navigate , isEducator } =useContext(AppContext)
  const isCourseslistspage = location.pathname.includes('/course-lists');
  const { openSignIn, signOut } = useClerk()
  const { isLoaded, isSignedIn, user } = useUser()

  // Fallback user display component
  const UserDisplay = () => {
    if (!isLoaded) {
      return <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
    }

    if (isSignedIn) {
      return (
        <div className="relative group">
          <UserButton />
          {/* Fallback in case UserButton fails */}
          <div className="hidden">
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 p-2 bg-white rounded shadow-lg min-w-32"
            >
              <img 
                src={user.imageUrl || assets.user_icon} 
                alt="User" 
                className="w-6 h-6 rounded-full"
              />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )
    }

    return (
      <button 
        onClick={() => openSignIn()}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <img src={assets.user_icon} alt="User icon" className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseslistspage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={()=> navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
      
      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'> 
        <div className='flex items-center gap-8'>
          {isSignedIn && user && (
            <>
              <button onClick={() => { navigate('/educator') }} className='hover:text-blue-600 transition-colors'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <Link to="/my-enrollments" className='hover:text-blue-600 transition-colors'>My Enrollments</Link>
            </>
          )}
        </div>
        <UserDisplay />
      </div>

      {/* Mobile Navigation */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {isSignedIn && user && (
            <>
              <button onClick={() => { navigate('/educator') }} className='hover:text-blue-600 transition-colors'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <Link to="/my-enrollments" className='hover:text-blue-600 transition-colors text-xs'>My Enrollments</Link>
            </>
          )}
        </div>
        <UserDisplay />
      </div>
    </div>
  )
}

export default Navbarstudent
