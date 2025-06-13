"use client"

import { DotBackgroundDemo } from './ui/griBackground'

const Footer = () => {
    return (
        <footer className="w-full pt-20 pb-10" id="contact">
            <div className="w-full absolute left-0 -bottom-72 min-h-96">
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <DotBackgroundDemo />   
                <p className="text-center text-white">Copyright © 2024 Rajendra Aurelius</p>
            </div>
            
        </footer>
    )
}

export default Footer