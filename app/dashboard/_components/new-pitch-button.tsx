"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileDialog } from "@/components/add-pitches/file-dialog";

interface NewPitchButtonProps {
    disabled?: boolean;
}

export const NewPitchButton = ({ disabled }: NewPitchButtonProps) => {
    return (
        <FileDialog disabled={disabled}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="aspect-[100/127] h-full"
            >
                <button
                    disabled={disabled}
                    className={cn(
                        "w-full h-full bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center",
                        disabled && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
                    )}
                >
                    <div className="flex flex-col items-center gap-2">
                        <Plus className="h-12 w-12 text-white stroke-1" />
                        <p className="text-sm text-white font-light">
                            New pitch
                        </p>
                    </div>
                </button>
            </motion.div>
        </FileDialog>
    );
};