import React from 'react'
import Hero from '../../components/educator/students/Hero'
import Companies from '../../components/educator/students/Companies'
import CoursesSection from '../../components/educator/students/Coursessection'
import Testimonialsections from '../../components/educator/students/Testimonialsections'
import CallToAction from '../../components/educator/students/CallToAction'
import Footer from '../../components/educator/students/Footer'

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <Companies />
      <CoursesSection />
      <Testimonialsections />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home