import React from "react";

interface CardProps {
    title?: React.ReactNode;
    description?: React.ReactNode
    stack?: React.ReactNode
    image?: React.ReactNode
}

export const ProjectCard = ({ title, description, stack, image }: CardProps) => {
    return (
        <div className="bg-white rounded-xl w-full mt-4 mb-4 p-4 flex flex-col shadow-md border-2 hover:border-gray-800 border-gray-100 duration-200 transform transition-colors ">

            <div className="w-full h-50 overflow-hidden rounded-xl mb-4">
                {image}
            </div>

            <div className="flex flex-col gap-2 mb-2">
                {title}
            </div>

            <div className="flex flex-col gap-2">
                {description}
            </div>

            <div className="flex flex-col gap-2">
                {stack}
            </div>

        </div>
    )
}