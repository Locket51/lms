import React, { useState } from 'react'
import { assets } from '../../../assets/assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
    const navigate = useNavigate()
    const [input, setInput] = useState(data || '')

    const onSearchHandler = (e) => {
        e.preventDefault()
        const searchTerm = input.trim()
        
        if (searchTerm) {
            navigate(`/course-lists/${encodeURIComponent(searchTerm)}`)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchHandler(e)
        }
    }

    return (
        <form 
            onSubmit={onSearchHandler} 
            className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm'
        >
            <img 
                src={assets.search_icon} 
                alt="search_icon" 
                className='w-5 h-5 mx-4 opacity-60' 
            />
            <input 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown}
                value={input}
                type="text" 
                placeholder='Search for courses' 
                className='w-full h-full outline-none text-gray-600 placeholder-gray-400'
            />
            <button 
                type='submit' 
                className='bg-blue-600 rounded-lg text-white md:px-8 px-6 h-full mx-2 hover:bg-blue-700 transition-colors font-medium'
            >
                Search
            </button>
        </form>
    )
}

export default SearchBar
