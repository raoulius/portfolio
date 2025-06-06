import React from 'react'

const MagicButton = ({
    title, icon, position, otherClasses
}: { title:string; icon:React.ReactNode, position:string; otherClasses?:string }) => {
  return (
    <button className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D4F2D2_0%,#E85D75_50%,#FAF3DD_100%)]" />
            <span className={`inline-flex h-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClasses}`}>
                {position === 'left' && icon}
                {title}
                {position === 'right' && icon}
            </span>
    </button>
  )
}

export default MagicButton