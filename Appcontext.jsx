import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { dummyCourses } from "../assets/assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    const calculateRating = (course) => {
        if (!course || !course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });
        return totalRating / course.courseRatings.length;
    };

    // Function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        if (!chapter || !chapter.chapterContent) {
            return humanizeDuration(0, {units: ["h", "m"]});
        }
        
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration || 0;
        });
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]});
    };

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        if (!course || !course.courseContent) {
            return humanizeDuration(0, {units: ["h", "m"]});
        }
        
        let time = 0;
        course.courseContent.forEach((chapter) => {
            if (chapter.chapterContent) {
                chapter.chapterContent.forEach((lecture) => {
                    time += lecture.lectureDuration || 0;
                });
            }
        });
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]});
    };

    // Function to calculate No of Lectures in the course
    const calculateNoOfLectures = (course) => {
        if (!course || !course.courseContent) {
            return 0;
        }
        
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    };
    //fetch user enrolled courses
    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses();
        fetchUserEnrolledCourses();
    }, []);

    const value = {
        currency, 
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        fetchUserEnrolledCourses,
        enrolledCourses
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for easier consumption - ADD THIS
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

// Remove the duplicate export at the bottom since they're already exported above