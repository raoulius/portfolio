'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Carousel, Card } from './ui/apple-cards-carousel'
import { appleCards } from '../data/index'

const Projects = () => {
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

  const cards = appleCards.map((project) => {
    const content = (
      <div>
        <p className="text-neutral-600 text-base md:text-lg font-normal mb-8 dark:text-neutral-400">
          {project.description}
        </p>
        <div className="mb-8">
          <h3 className="text-neutral-700 text-lg font-semibold mb-4 dark:text-neutral-300">
            Key Features:
          </h3>
          <ul className="text-neutral-600 text-base space-y-2 dark:text-neutral-400">
            {project.features.map((feature, idx) => (
              <li key={idx}>• {feature}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          {project.technologies.map((tech, idx) => (
            <div key={idx} className="bg-neutral-100 px-4 py-2 rounded-full text-sm dark:bg-neutral-800">
              {tech}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <Card 
        key={project.title} 
        card={{
          category: project.category,
          title: project.title,
          src: project.src,
          content: content
        }} 
        layout={true} 
      />
    );
  });

  return (
    <section 
      ref={sectionRef}
      className={`w-full py-20 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            My Projects
          </h2>
          <p className="text-xl text-white max-w-3xl">
            Discover my latest work and creative projects.
          </p>
        </div>
        <Carousel items={cards} />
      </div>
    </section>
  )
}

export default Projects