import React from 'react'
import { assets } from '../../../assets/assets/assets'
import SearchBar from './Searchbar'

const Hero = () => {
    return (
        <div className='flex flex-col items-center space-y-7 text-center w-full md:pt-36 pt-20 px-7 md:px-0 bg-gradient-to-b from-cyan-100/70 pb-20'>
            <h1 className='md:text-5xl text-3xl font-bold text-gray-800 max-w-3xl mx-auto leading-tight'>
                Empower your future with the courses designed to <span className='text-blue-600'>fit your choice.</span>
            </h1>
            
            <p className='hidden md:block text-gray-500 max-w-2xl mx-auto text-lg'>
                We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
            </p>
            
            <p className='block md:hidden text-gray-500 max-w-sm mx-auto text-base'>
                We bring together world-class instructors to help you achieve your professional goals.
            </p>

            

            <img src={assets.sketch} alt="sketch" className='mt-8 max-w-xs md:max-w-md' />
            <SearchBar />
        </div>
    )
}

export default Hero
