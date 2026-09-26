import React from "react";
import Image from "next/image";
import {StackIcons} from "@/components/reusables/stackIcons";
import { getProjects } from "@/lib/db";

export default async function Projects() {
    const projects = await getProjects()
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {projects.map((project, index) => (
                <article
                    key={project.id}
                    className="tile reveal group flex flex-col overflow-hidden rounded-xl border border-(--rule) bg-(--surface) transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:first:col-span-2"
                    style={{ '--index': index % 2 } as React.CSSProperties}
                >
                    <div className="px-7 pt-9 md:px-10 md:pt-11">
                        <h3 className="font-editorial text-[1.75rem] text-(--ink-strong) md:text-[2rem]">{project.title}</h3>
                        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-(--ink-muted)">{project.description}</p>
                        <div className="mt-5 flex items-center justify-between gap-4">
                            <StackIcons stack={project.stack} />
                            {project.link_url && (
                                <a
                                    href={project.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 text-sm text-(--ink-strong) underline decoration-(--ink-muted) decoration-1 underline-offset-4 transition-colors hover:decoration-(--ink-strong)"
                                >
                                    Visit <span aria-hidden>↗</span>
                                </a>
                            )}
                        </div>
                    </div>
                    {project.image_url && (
                        // faux window chrome, bleeding off the bottom edge of the tile
                        <div className="mt-auto px-7 pt-9 md:px-10 md:pt-11">
                            <div className="overflow-hidden rounded-t-lg border border-b-0 border-(--rule) bg-(--canvas)">
                                <div className="flex gap-1.5 px-3 py-2.5" aria-hidden>
                                    <span className="size-2 rounded-full bg-(--rule)"/>
                                    <span className="size-2 rounded-full bg-(--rule)"/>
                                    <span className="size-2 rounded-full bg-(--rule)"/>
                                </div>
                                <Image
                                    src={project.image_url}
                                    alt={project.title}
                                    width={1200}
                                    height={750}
                                    className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                                />
                            </div>
                        </div>
                    )}
                </article>
            ))}
        </div>
    )
}
