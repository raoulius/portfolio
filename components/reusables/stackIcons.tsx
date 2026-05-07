import Image from "next/image";

interface StackIconsProps {
    icons: string[];
}

export const StackIcons = ({ icons }: StackIconsProps) => {
    return (
        <div className="flex items-center gap-2 flex-wrap mt-2">
            {icons.map((icon, index) => (
                <div
                    key={index}
                    className="w-6 h-6 relative"
                >
                    <Image
                        src={icon}
                        alt={`stack-${index}`}
                        fill
                        className="object-contain"
                    />
                </div>
            ))}
        </div>
    );
};