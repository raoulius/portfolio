'use client'
import React from "react";
import {ProjectCard} from "@/components/reusables/projectCards";
import {Stack, Imaged, Subtitle, Title} from "@/components/reusables/cardComponents";
import {StackIcons} from "@/components/reusables/stackIcons";

export default function Projects() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProjectCard
                image={<div  className="object-contain w-full">
                      <Imaged imageUrl={"/project/senatfh.jpg"} />
                    </div>}
                title={
                    <div>
                        <Title text="System Information with Face Recognition" />
                    </div>
                }
                description={
                    <Subtitle text="Freelance project with Meraki for the Senate of Law Universitas Diponegoro. Equipped with
                    face recognition attendance taking, file status tracker, room booking tracker, and all kinds of manual work digitalized." />
                }
                stack={
                    <StackIcons
                        icons={[
                            "/stackIcons/laravel.png",
                            "/stackIcons/python.png"
                        ]}
                    />
                }
            />
            <ProjectCard
                image={<div  className="object-contain w-full">
                    <Imaged imageUrl={"/project/nox.png"} />
                </div>}
                title={
                    <div>
                        <Title text="Nox Topup Game Service" />
                    </div>
                }
                description={
                    <Subtitle text="" />
                }
                stack={
                    <Stack text="Some description here" />
                }
            />
            <ProjectCard
                image={<div  className="object-contain w-full">
                    <Imaged imageUrl={"/me.jpeg"} />
                </div>}
                title={
                    <div>
                        <Title text="hey" />
                    </div>
                }
                description={
                    <Subtitle text="Some subtitle" />
                }
                stack={
                    <Stack text="Some description here" />
                }
            />
            <ProjectCard
                image={<div  className="object-contain w-full">
                    <Imaged imageUrl={"/me.jpeg"} />
                </div>}
                title={
                    <div>
                        <Title text="hey" />
                    </div>
                }
                description={
                    <Subtitle text="Some subtitle" />
                }
                stack={
                    <Stack text="Some description here" />
                }
            />
            <ProjectCard
                image={<div  className="object-contain w-full">
                    <Imaged imageUrl={"/me.jpeg"} />
                </div>}
                title={
                    <div>
                        <Title text="hey" />
                    </div>
                }
                description={
                    <Subtitle text="Some subtitle" />
                }
                stack={
                    <Stack text="Some description here" />
                }
            />
        </div>
    )
}