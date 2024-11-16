import {motion} from "framer-motion";

interface FilePreviewProps {
    file: File;
}

export const FilePreview = ({file}: FilePreviewProps) => {
    return (
        <motion.div
            className="mt-4 p-4 bg-muted rounded-lg"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
        >
            <div className="flex justify-between w-full items-center gap-4">
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    layout
                    className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                >
                    {file.name}
                </motion.p>
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    layout
                    className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                >
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                </motion.p>
            </div>
            <div
                className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    layout
                    className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                >
                    {file.type}
                </motion.p>
                <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    layout
                >
                    modified {new Date(file.lastModified).toLocaleDateString()}
                </motion.p>
            </div>
        </motion.div>
    );
};