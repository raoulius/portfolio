import React from 'react';
import Image from "next/image";

export const Title = ({ text }: { text: string }) => {
    return <h1 className="title" >{text}</h1>;
}

export const Subtitle = ({ text }: { text: string }) => {
    return <h2 className="subtitle">{text}</h2>;
}

export const Stack = ({ text }: { text: string }) => {
    return <p className="stack">{text}</p>;
}

export const DashedDescription = ({ text }: { text: string }) => {
    return <p className="description dashed">{text}</p>;
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