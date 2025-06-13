import React from 'react'
import { FocusCards } from './ui/focus-cards'
import { aboutMeCards } from '../data/index'

const AboutMe = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3'>
        <div className="mb-16">
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>About Me</h1>
            <p className='text-xl text-white max-w-3xl'>
                Fun little section where i get to say things about myself.
            </p>


        </div>
    </div>
  )
}

export default AboutMe