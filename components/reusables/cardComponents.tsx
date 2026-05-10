import React from 'react';
import Image from "next/image";

export const Title = ({ children }: { children: React.ReactNode }) => {
    return <h1 className="title">{children}</h1>;
}

export const Subtitle = ({ children }: { children: React.ReactNode }) => {
    return <h2 className="subtitle">{children}</h2>;
}

export const Stack = ({ children }: { children: React.ReactNode }) => {
    return <p className="stack">{children}</p>;
}

export const DashedDescription = ({ children }: { children: React.ReactNode }) => {
    return <p className="description dashed">{children}</p>;
}

export const Imaged = ({ imageUrl }: { imageUrl: string }) => {
    return (
        <Image
            src={imageUrl}
            alt="project image"
            width={500}
            height={300}
            className="rounded-xl object-cover"
        />
    );
};