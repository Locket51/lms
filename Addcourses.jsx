import React, { useRef, useState, useEffect } from 'react'
import Quill from 'quill'
import Loading from '../../../components/educator/students/Loading'
import { assets } from '../../../assets/assets/assets'

// Browser-compatible ID generator
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const AddCourse = () => {
    const quillRef = useRef(null)
    const editorRef = useRef(null)

    const [courseTitle, setCourseTitle] = useState('')
    const [coursePrice, setCoursePrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [image, setImage] = useState(null)
    const [chapters, setChapters] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [currentChapterId, setCurrentChapterId] = useState(null)
    const [lectureDetails, setLectureDetails] = useState({
        lectureTitle: '',
        lectureDuration: '',
        lectureUrl: '',
        isPreviewFree: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChapter = (action, chapterId) => {
        if (action === 'add') {
            const title = prompt('Enter Chapter Name:');
            if (title) {
                const newChapter = {
                    chapterId: generateId(),
                    chapterTitle: title,
                    chapterContent: [],
                    collapsed: false,
                    chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
                };
                setChapters([...chapters, newChapter]);
            }
        } else if (action === 'remove') {
            setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
        } else if (action === 'toggle') {
            setChapters(
                chapters.map((chapter) =>
                    chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
                )
            );
        }
    };

    const handleLecture = (action, chapterId, lectureId) => {
        if (action === 'add') {
            setCurrentChapterId(chapterId);
            setShowPopup(true);
        } else if (action === 'remove') {
            setChapters(chapters.map(chapter => 
                chapter.chapterId === chapterId 
                    ? { ...chapter, chapterContent: chapter.chapterContent.filter(lecture => lecture.lectureId !== lectureId) }
                    : chapter
            ));
        }
    };

    const addLectureToChapter = () => {
        if (currentChapterId && lectureDetails.lectureTitle && lectureDetails.lectureUrl) {
            const newLecture = {
                lectureId: generateId(),
                ...lectureDetails
            };
            
            setChapters(chapters.map(chapter => 
                chapter.chapterId === currentChapterId 
                    ? { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] }
                    : chapter
            ));
            
            setLectureDetails({
                lectureTitle: '',
                lectureDuration: '',
                lectureUrl: '',
                isPreviewFree: false,
            });
            setShowPopup(false);
            setCurrentChapterId(null);
        }
    };

    // Calculate total course duration
    const calculateTotalDuration = () => {
        return chapters.reduce((total, chapter) => {
            const chapterDuration = chapter.chapterContent.reduce((chapTotal, lecture) => {
                return chapTotal + (parseInt(lecture.lectureDuration) || 0)
            }, 0)
            return total + chapterDuration
        }, 0)
    }

    // Format duration in hours and minutes
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours}h ${mins}m`
        }
        return `${mins}m`
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!courseTitle.trim()) {
            alert('Please enter a course title');
            return;
        }

        if (chapters.length === 0) {
            alert('Please add at least one chapter');
            return;
        }

        // Check if all chapters have at least one lecture
        const emptyChapters = chapters.filter(chapter => chapter.chapterContent.length === 0);
        if (emptyChapters.length > 0) {
            alert('All chapters must have at least one lecture');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get Quill editor content
            const courseDescription = quillRef.current ? quillRef.current.root.innerHTML : '';

            // Prepare course data
            const courseData = {
                courseTitle: courseTitle.trim(),
                courseDescription,
                coursePrice: parseFloat(coursePrice) || 0,
                discount: parseFloat(discount) || 0,
                image,
                chapters: chapters.map(chapter => ({
                    ...chapter,
                    chapterContent: chapter.chapterContent.map(lecture => ({
                        ...lecture,
                        lectureDuration: parseInt(lecture.lectureDuration) || 0
                    }))
                })),
                totalDuration: calculateTotalDuration(),
                createdAt: new Date().toISOString(),
                enrolledStudents: [],
                ratings: [],
                isPublished: false
            };

            console.log('Course Data to be submitted:', courseData);
            
            // Here you would typically send the data to your backend API
            // For now, we'll just show a success message
            alert('Course created successfully!');
            
            // Reset form
            setCourseTitle('');
            setCoursePrice(0);
            setDiscount(0);
            setImage(null);
            setChapters([]);
            if (quillRef.current) {
                quillRef.current.root.innerHTML = '';
            }
            
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Error creating course. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // initiate Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                    ]
                },
            });
        }
    }, []);

    const totalDuration = calculateTotalDuration();

    return (
        <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <p>Course Title</p>
                    <input 
                        onChange={e => setCourseTitle(e.target.value)} 
                        value={courseTitle}
                        type="text" 
                        placeholder='Type here' 
                        className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' 
                        required 
                    />
                </div>
                
                <div className='flex flex-col gap-1'>
                    <p>Course Description</p>
                    <div ref={editorRef} style={{ height: '200px' }}></div>
                </div>
                
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='flex flex-col gap-1'>
                        <p>Course Price</p>
                        <input 
                            onChange={e => setCoursePrice(e.target.value)} 
                            value={coursePrice}
                            type="number" 
                            placeholder='0' 
                            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' 
                            required 
                            min="0"
                        />
                    </div>

                    <div className='flex md:flex-row flex-col items-center gap-3'>
                        <p>Course Thumbnail</p>
                        <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
                            <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded cursor-pointer' />
                            <input 
                                type="file" 
                                id='thumbnailImage' 
                                onChange={e => setImage(e.target.files[0])} 
                                accept="image/*" 
                                hidden 
                            />
                            {image && (
                                <img 
                                    className='max-h-10 rounded' 
                                    src={URL.createObjectURL(image)} 
                                    alt="Course thumbnail preview" 
                                />
                            )}
                        </label>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p>Discount %</p>
                        <input 
                            onChange={e => setDiscount(e.target.value)} 
                            value={discount}
                            type="number" 
                            placeholder='0' 
                            min={0} 
                            max={100} 
                            className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' 
                            required 
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p>Total Duration</p>
                        <div className='outline-none md:py-2.5 py-2 w-32 px-3 rounded border border-gray-500 bg-gray-50 text-center'>
                            {formatDuration(totalDuration)}
                        </div>
                    </div>
                </div>

                {/* Adding Chapters & Lectures */}
                <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-4'>Course Content</h3>
                    {chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
                            <div className="flex justify-between items-center p-4 border-b">
                                <div className="flex items-center">
                                    <img 
                                        src={assets.dropdown_icon} 
                                        width={14} 
                                        alt="" 
                                        className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`}
                                        onClick={() => handleChapter('toggle', chapter.chapterId)}
                                    />
                                    <span className="font-semibold">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
                                    <img 
                                        src={assets.cross_icon} 
                                        alt="" 
                                        className='cursor-pointer' 
                                        onClick={() => handleChapter('remove', chapter.chapterId)}
                                    />
                                </div>
                            </div>
                            {!chapter.collapsed && (
                                <div className="p-4">
                                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                                        <div key={lecture.lectureId} className="flex justify-between items-center mb-2 p-2 hover:bg-gray-50 rounded">
                                            <span>{lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</span>
                                            <img 
                                                src={assets.cross_icon} 
                                                alt="" 
                                                className='cursor-pointer'
                                                onClick={() => handleLecture('remove', chapter.chapterId, lecture.lectureId)}
                                            />
                                        </div>
                                    ))}
                                    <div 
                                        className='inline-flex bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition-colors' 
                                        onClick={() => handleLecture('add', chapter.chapterId)}
                                    >
                                        + Add Lecture
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    <div 
                        className='flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors' 
                        onClick={() => handleChapter('add')}
                    >
                        + Add Chapter
                    </div>

                    {showPopup && (
                        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
                            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

                                <div className="mb-2">
                                    <p>Lecture Title</p>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border rounded py-1 px-2"
                                        value={lectureDetails.lectureTitle}
                                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <p>Duration (minutes)</p>
                                    <input
                                        type="number"
                                        className="mt-1 block w-full border rounded py-1 px-2"
                                        value={lectureDetails.lectureDuration}
                                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="mb-2">
                                    <p>Lecture URL</p>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border rounded py-1 px-2"
                                        value={lectureDetails.lectureUrl}
                                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 my-4">
                                    <p>Is Preview Free?</p>
                                    <input
                                        type="checkbox"
                                        className='mt-1 scale-125'
                                        checked={lectureDetails.isPreviewFree}
                                        onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                                    />
                                </div>

                                <button 
                                    type='button' 
                                    className="w-full bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                                    onClick={addLectureToChapter}
                                >
                                    Add Lecture
                                </button>

                                <img 
                                    onClick={() => setShowPopup(false)} 
                                    src={assets.cross_icon}
                                    className='absolute top-4 right-4 w-4 cursor-pointer' 
                                    alt="Close" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                <button 
                    type="submit" 
                    className='bg-black text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating Course...' : 'ADD COURSE'}
                </button>
            </form>
        </div>
    )
}

export default AddCourse