import React, { useContext } from 'react'
import { assets } from '../../assets/assets/assets'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../../context/Appcontext'

const Sidebar = () => {
    const { isEducator } = useContext(AppContext)

    const menuItems = [
        {
            name: 'Dashboard', 
            path: '/educator', 
            icon: assets.home_icon 
        },
        {
            name: 'Add Course', 
            path: '/educator/add-course', 
            icon: assets.add_icon 
        },
        {
            name: 'My Courses', 
            path: '/educator/my-courses', 
            icon: assets.my_course_icon 
        },
        {
            name: 'Student Enrolled', 
            path: '/educator/student-enrolled', 
            icon: assets.person_tick_icon 
        },
    ]

    return isEducator && (
        <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-4 flex flex-col gap-2'>
            {menuItems.map((item) => (
                <NavLink
                    to={item.path}
                    key={item.name}
                    end={item.path === '/educator'}
                    className={({ isActive }) => 
                        `flex items-center gap-3 p-3 mx-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 ${
                            isActive 
                                ? 'bg-blue-100 text-blue-600 border-r-2 border-blue-600 font-medium' 
                                : 'text-gray-600 hover:border-r-2 hover:border-blue-200'
                        }`
                    }
                >
                    <img 
                        src={item.icon} 
                        alt={item.name} 
                        className="w-5 h-5 transition-transform duration-200" 
                    />
                    <span className='md:block hidden text-sm font-medium'>{item.name}</span>
                </NavLink>
            ))}
        </div>
    )
}

export default Sidebar
