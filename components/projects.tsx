import React from "react";
import {ProjectCard} from "@/components/reusables/projectCards";
import { Imaged, Subtitle, Title} from "@/components/reusables/cardComponents";
import {StackIcons} from "@/components/reusables/stackIcons";
import { getProjects } from "@/lib/db";

export default async function Projects() {
    const projects = await getProjects()
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => {
                const image = project.image_url && <Imaged imageUrl={project.image_url} />
                return (
                    <ProjectCard
                        key={project.id}
                        image={project.link_url ? (
                            <a
                                href={project.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full h-full"
                            >
                                {image}
                            </a>
                        ) : image}
                        title={<Title>{project.title}</Title>}
                        description={<Subtitle>{project.description}</Subtitle>}
                        stack={<StackIcons stack={project.stack} />}
                    />
                )
            })}
        </div>
    )
}
