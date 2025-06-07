import React from 'react'
import { TextGenerateEffect } from './ui/text-generate-effect'
import MagicButton from './ui/MagicButton'
import { FaFileDownload, FaLocationArrow } from 'react-icons/fa'
import { AuroraBackground } from './ui/aurora-background'

const Hero = () => {
  return (
    <div className="w-screen overflow-hidden">
      <AuroraBackground>
          <div className='h-[90vh] relative'>
              <div className="relative flex h-full items-center justify-center z-10 -mt-15 px-4 sm:px-6 lg:px-8">
                  <div className='max-w-[89w] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'>
                      <h2 className='uppercase tracking-widest text-sm md:text-base text-center w-full text-white'>
                          Rajendra Aurelius Ritmanto
                      </h2>

                      <div className="flex flex-col gap-2">
                          <TextGenerateEffect 
                              className='text-center text-[40px] md:text-5xl lg:text-6xl'
                              words="A Software Engineer in Indonesia"
                          />
                      </div>

                      <p className='text-center md:tracking-wider mb-4 text-xl md:text-2xl text-white max-w-3xl'>
                        Last Semester Computer Engineering Student
                      </p>
                      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                          <MagicButton 
                              title="Resume"
                              icon={<FaFileDownload />}
                              position="right"
                          />
                      </a>
                  </div>
              </div>
          </div>
      </AuroraBackground>
    </div>
  )
}

export default Hero