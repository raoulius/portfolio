'use client'
import React, { useEffect, useRef, useState } from 'react'
import { BentoGrid, BentoGridItem} from './ui/bento-grid'
import { gridItems } from '../data/index'

const Grid = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before element comes into view
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
    <section 
      ref={sectionRef}
      id="about" 
      className={`px-4 sm:px-6 md:px-8 lg:px-10 mt-8 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
        <BentoGrid>
            {gridItems.map((item, _) => (
                <BentoGridItem 
                id={item.id}
                key={item.id}
                title={item.title}
                description={item.description}
                header={item.header}
                logo={item.logo || null}
                logoBgColor={item.logoBgColor}
                className={item.className}
                />
            ))}
        </BentoGrid>
    </section>
  )
}

export default Grid