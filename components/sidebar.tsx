'use client';

import Image from 'next/image';
import useLayoutHandler from '../_handler/useLayoutHandler';
import MukaRajendra from '../public/selfie rajendra.jpeg'
import github from '../public/github-logo.png'
import linkedin from '../public/linkedin.png'
import emailIcon from '../public/normalIcons/mail.svg'
import resumeIcon from '../public/normalIcons/file-plus.svg'

export function Sidebar() {
    const { copied, handleEmailClick } = useLayoutHandler();

    return (
        <aside className="w-64 bg-white border-r p-4 fixed h-full top-0 left-0">
            <nav className="flex flex-col gap-2">
                <Image src={MukaRajendra} alt="Muka gw" priority width={500}
                       height={300}
                       className="rounded-xl object-cover"/>
                <h2 className="font-bold">Rajendra Aurelius Ritmanto</h2>
                <h2 className="font-bold mb-4">Software Engineer</h2>
                <div className="flex items-center gap-2">
                    <Image src={github} alt="github logo" priority width={20}/>
                    <a href="https://github.com/raoulius" className="hover:text-blue-500">Github</a>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={linkedin} alt="linkedin logo" priority width={20}/>
                    <a href="https://www.linkedin.com/in/rajendra-aurelius-3406a1217/" className="hover:text-blue-500">LinkedIn</a>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={resumeIcon} alt="resume icon" priority width={20}/>
                    <a href="/resume.pdf" target="_blank" className="hover:text-blue-500">Resume</a>
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={handleEmailClick}
                >
                    <Image src={emailIcon} alt="email icon" priority width={20}/>
                    <span className="group-hover:text-blue-500">
            {copied ? 'Copied!' : 'rritmanto@gmail.com'}
          </span>
                </div>
            </nav>
        </aside>
    );
}