import Image from "next/image";
import { STACK_ICONS } from "@/lib/stack";

export const StackIcons = ({ stack }: { stack: string[] }) => {
    return (
        <div className="flex items-center gap-2 flex-wrap mt-2">
            {stack.filter((key) => key in STACK_ICONS).map((key) => {
                const { label, src, mono } = STACK_ICONS[key]
                return (
                    <div key={key} className="w-6 h-6 relative" title={label}>
                        <Image src={src} alt={label} fill className={`object-contain ${mono ? 'dark:invert' : ''}`} />
                    </div>
                )
            })}
        </div>
    );
};
