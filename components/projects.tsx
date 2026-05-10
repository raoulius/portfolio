'use client'
import React from "react";
import {ProjectCard} from "@/components/reusables/projectCards";
import { Imaged, Subtitle, Title} from "@/components/reusables/cardComponents";
import {StackIcons} from "@/components/reusables/stackIcons";

export default function Projects() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProjectCard
                image={
                    <a
                        href="https://senatfhundip.my.id/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block object-contain w-full"
                    >
                        <Imaged imageUrl={"/project/qash.png"} />
                    </a>
                }
                title={
                    <Title>
                        Qash
                    </Title>
                }
                description={
                    <Subtitle>
                        Point of Sales system currently piloting in 3 cafes. Free to use for any merchant. Has inventory and HR system built in too.
                    </Subtitle>
                }
                stack={
                    <StackIcons
                        icons={[
                            "/stackIcons/laravel.png",
                            "/stackIcons/python.png",
                            "/stackIcons/mysql.png"
                        ]}
                    />
                }
            />
            <ProjectCard
                image={
                    <a
                        href="https://senatfhundip.my.id/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block object-contain w-full"
                    >
                        <Imaged imageUrl={"/project/senatfh.jpg"} />
                    </a>
                }
                title={
                    <Title>
                        System Information with Face Recognition
                    </Title>
                }
                description={
                    <Subtitle>
                        Freelance project with Meraki for the Senate of Law
                        Universitas Diponegoro. Equipped with face recognition
                        attendance taking, file status tracker, room booking tracker,
                        and all kinds of manual work digitalized.
                        Handled deployment as well.
                    </Subtitle>
                }
                stack={
                    <StackIcons
                        icons={[
                            "/stackIcons/laravel.png",
                            "/stackIcons/python.png",
                            "/stackIcons/mysql.png"
                        ]}
                    />
                }
            />
            <ProjectCard
                image={
                    <a
                        href="https://noxconnection.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block object-contain w-full"
                    >
                        <Imaged imageUrl={"/project/nox.png"} />
                    </a>
                }
                title={
                    <div>
                        <Title>Nox Topup Game Service</Title>
                    </div>
                }
                description={
                    <Subtitle>
                        Created a discord bot to automatically rank customers inside
                        the discord server by how much they spent. Also created a
                        landing page and handled SEO.
                    </Subtitle>
                }
                stack={
                    <StackIcons
                        icons={[
                            "/stackIcons/laravel.png",
                            "/stackIcons/python.png",
                            "/stackIcons/javascript.png",
                            "/stackIcons/postgres.png",
                        ]}
                    />
                }
            />

        </div>
    )
}