import React from 'react'
import { assets } from '../../../assets/assets/assets'

const CallToAction = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Learn anything, anytime, anywhere
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
                Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
            </p>
            <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Get started
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    Learn more <img src={assets.arrow_icon} alt="arrow_icon" className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default CallToAction
