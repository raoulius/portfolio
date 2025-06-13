'use client'
import React, { useEffect, useRef, useState } from 'react'

const Tech = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -10px 0px' // Start animation 50px before element comes into view
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div 
      ref={sectionRef}
      className={`w-full bg-black transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3'>
            <div className="mb-16">
                <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>Tech Stack</h1>
                <p className='text-xl text-white max-w-3xl'>
                  The technologies that help me build robust, scalable applications with seamless performance and efficiency..
                </p>
            </div>
        </div>
    </div>
  )
}

export default Tech