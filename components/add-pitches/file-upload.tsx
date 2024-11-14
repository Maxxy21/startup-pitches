import {cn} from "@/lib/utils";

import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {CardFooter} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useFormStatus} from "react-dom";
import React, {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useDropzone} from "react-dropzone";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {evaluatePitch, transcribeAudio} from "@/actions/openai";
import {fileToText} from "@/utils";
import {useForm} from "react-hook-form";
import {Dropzone} from "@/components/add-pitches/dropzone";

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

const FormSchema = z.object({
    pitchName: z.string().min(2, {
        message: "Pitch name must be at least 2 characters.",
    }),
    contentType: z.enum(['audio', 'textFile', 'text']),
    content: z.string().optional(),
    file: z.any().optional(),
})

export const FileUpload = () => {
    const createPitchEmbeddings = useAction(api.pitches.createPitchEmbeddings);
    const { pending } = useFormStatus();
    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pitchName: "",
            contentType: "audio",
            content: "",
            file: null,
        }
    });

    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
        form.setValue("file", newFiles);
    };

    const dropzoneProps = useDropzone({
        multiple: false,
        onDrop: handleFileChange,
        accept: form.watch("contentType") === "audio"
            ? { 'audio/*': ['.mp3', '.wav', '.m4a'] }
            : { 'text/plain': ['.txt'] },
        noClick: false,
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        const { pitchName, contentType, content } = data;
        let transcriptionText = content || "";

        if (files.length > 0) {
            if (contentType === 'audio') {
                const formData = new FormData();
                formData.append('audio', files[0]);
                transcriptionText = await transcribeAudio(formData);
            } else if (contentType === 'textFile') {
                transcriptionText = await fileToText(files[0]);
            }
        }

        const evaluationResults = await evaluatePitch(transcriptionText);
        await createPitchEmbeddings({
            name: pitchName,
            text: transcriptionText,
            evaluation: evaluationResults
        });

        setFiles([]);
        form.reset();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.button
                    className="pl-2 flex mt-2 flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-2 justify-center">
                        <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white"/>
                        <h3 className="text-base font-light tracking-tight text-foreground/70">
                            Add Pitch
                        </h3>
                    </div>
                </motion.button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle>Upload your file</DialogTitle>
                    <DialogDescription>
                       You can upload your audio or text file here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pitchName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your pitch name"
                                            className="border-0 font-semibold text-lg border-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contentType"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setFiles([]);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className="border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select upload type"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="audio">Audio</SelectItem>
                                            <SelectItem value="textFile">Text File</SelectItem>
                                            <SelectItem value="text">Text</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <AnimatePresence mode="wait">
                            {form.watch("contentType") !== "text" ? (
                                <Dropzone
                                    contentType={form.watch("contentType")}
                                    files={files}
                                    {...dropzoneProps}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[200px] resize-none"
                                                    placeholder="Enter your pitch text here..."
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </AnimatePresence>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={pending}
                                className="w-full sm:w-auto"
                            >
                                {pending ? "Adding..." : "Add Pitch"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div
            className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
            {Array.from({length: rows}).map((_, row) =>
                Array.from({length: columns}).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                                index % 2 === 0
                                    ? "bg-gray-50 dark:bg-neutral-950"
                                    : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                            }`}
                        />
                    );
                })
            )}
        </div>
    );
}
