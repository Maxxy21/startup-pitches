import {motion} from "framer-motion";
import {IconUpload} from "@tabler/icons-react";
import {FilePreview} from "@/components/add-pitches/file-preview";

interface DropzoneProps {
    contentType: string;
    getRootProps: any;
    getInputProps: any;
    isDragActive: boolean;
    files: File[];
}

export const Dropzone = ({contentType, getRootProps, getInputProps, isDragActive, files}: DropzoneProps) => {
    return (
        <motion.div
            className="w-full"
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "auto"}}
            exit={{opacity: 0, height: 0}}
        >
            <div {...getRootProps()}
                 className="p-8 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary transition-colors"
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <IconUpload className="h-8 w-8 text-primary"/>
                    <p className="text-sm text-muted-foreground text-center">
                        {isDragActive
                            ? "Drop the files here..."
                            : `Drag & drop or click to select ${contentType === "audio" ? "audio" : "text"} files`
                        }
                    </p>
                </div>
                {files.length > 0 && <FilePreview file={files[0]}/>}
            </div>
        </motion.div>
    );
};