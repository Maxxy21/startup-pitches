import Image from "next/image";
import LogoIcon from "@/components/ui/logo-icon";

export const Loading = () => {
    return (
        <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100 dark:bg-neutral-900 ">
            {/*<Image*/}
            {/*  src="/logo.svg"*/}
            {/*  alt="Logo"*/}
            {/*  width={120}*/}
            {/*  height={120}*/}
            {/*  priority={false}*/}
            {/*  className="animate-pulse duration-700"*/}
            {/*/>*/}
            <div  className="animate-pulse duration-800 flex items-center flex-1 justify-center gap-2" >
                <LogoIcon/>
                <h1 className="text-lg font-semibold">Pitch Perfect</h1>
            </div>

        </div>
    );
};
