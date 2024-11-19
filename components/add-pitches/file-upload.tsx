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
import React, {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useDropzone} from "react-dropzone";

import {FormSchema} from "@/components/add-pitches/form-schema";

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {evaluatePitch, transcribeAudio} from "@/actions/openai";
import {fileToText} from "@/utils";
import {useForm} from "react-hook-form";
import {Dropzone} from "@/components/add-pitches/dropzone";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


export const mockEvaluation = {
    evaluations: [
        {
            criteria: "Problem-Solution Fit",
            comment: "The pitch demonstrates a clear understanding of the problem and presents a viable solution.",
            score: 8,
            strengths: ["Clear problem identification", "Innovative solution", "Market understanding"],
            improvements: ["Add more market validation", "Expand on competitive analysis"],
            aspects: ["Problem clarity", "Solution viability", "Market fit", "Innovation"]
        },
        {
            criteria: "Business Potential",
            comment: "Strong business model with good growth potential.",
            score: 7,
            strengths: ["Scalable model", "Clear revenue streams", "Large market opportunity"],
            improvements: ["More financial projections", "Detailed go-to-market strategy"],
            aspects: ["Market size", "Revenue model", "Scalability", "Growth strategy"]
        },
        {
            criteria: "Presentation Quality",
            comment: "Well-structured presentation with clear communication.",
            score: 8,
            strengths: ["Clear structure", "Engaging delivery", "Professional presentation"],
            improvements: ["Add more visual aids", "Include more data points"],
            aspects: ["Clarity", "Structure", "Engagement", "Professionalism"]
        }
    ],
    overallScore: 7.7,
    overallFeedback: "This is a strong pitch with clear potential. The problem-solution fit is well-defined, and the business model shows promise. Some improvements in market validation and financial projections would strengthen the pitch further."
};


interface FileUploadProps {
    disabled?: boolean;
};


export const FileUpload = ({disabled}: FileUploadProps) => {
    const router = useRouter();
    const {mutate, pending} = useApiMutation(api.pitches.createPitch);

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
            ? {'audio/*': ['.mp3', '.wav', '.m4a']}
            : {'text/plain': ['.txt']},
        noClick: false,
    });

    // const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    //     try {
    //         const {pitchName, contentType, content} = data;
    //         let transcriptionText = "";  // Initialize as empty string
    //
    //         if (contentType === 'text') {
    //             transcriptionText = content || "";  // Use content for text input
    //         } else if (files.length > 0) {
    //             if (contentType === 'audio') {
    //                 const formData = new FormData();
    //                 formData.append('audio', files[0]);
    //                 transcriptionText = await transcribeAudio(formData);
    //             } else if (contentType === 'textFile') {
    //                 transcriptionText = await fileToText(files[0]);
    //             }
    //         }
    //
    //         // Make sure we have text before proceeding
    //         if (!transcriptionText) {
    //             throw new Error("No text content provided");
    //         }
    //
    //         const evaluationResults = await evaluatePitch(transcriptionText);
    //
    //         await createPitch({
    //             name: pitchName,
    //             text: transcriptionText,  // Make sure this is always provided
    //             type: contentType,
    //             status: "evaluated",
    //             evaluation: {
    //                 evaluations: evaluationResults.evaluations,
    //                 overallScore: evaluationResults.overallScore,
    //                 overallFeedback: evaluationResults.overallFeedback,
    //             },
    //             createdAt: Date.now(),
    //             updatedAt: Date.now(),
    //         });
    //
    //         setFiles([]);
    //         form.reset();
    //     } catch (error) {
    //         console.error("Error creating pitch:", error);
    //         // TODO: Show error message and Toast notification
    //     }
    // };

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        console.log("Form data:", data);
        const {pitchName, contentType, content} = data;
        let transcriptionText = "";

        console.log("Content type:", contentType);
        console.log("Files:", files);

        if (contentType === 'text') {
            transcriptionText = content || "";
            console.log("Text content:", transcriptionText);
        } else if (files.length > 0) {
            transcriptionText = "This is a dummy transcription for testing purposes...";
            console.log("Using dummy transcription");
        }

        if (!transcriptionText) {
            console.log("No transcription text available");
            throw new Error("No text content provided");
        }

        console.log("Final transcription:", transcriptionText);
        console.log("Mock evaluation:", mockEvaluation);

        // Use mock evaluation instead of API call
        const evaluationResults = mockEvaluation;
        // const evaluationResults = await evaluatePitch(transcriptionText);
        mutate({
            name: pitchName,
            text: transcriptionText,
            type: contentType,
            status: "evaluated",
            evaluation: {
                evaluations: evaluationResults.evaluations,
                overallScore: evaluationResults.overallScore,
                overallFeedback: evaluationResults.overallFeedback,
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
            .then((id) => {
                toast.success("Board created");
                router.push(`/board/${id}`);
                setFiles([]);
                form.reset();
            })
            .catch(() => toast.error("Failed to create pitch"));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.button
                    className="pl-2 flex mt-2 flex-1"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                >
                    <button
                        disabled={pending || disabled}
                        className={cn(
                            "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
                            (pending || disabled) && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
                        )}
                    >
                        <div/>
                        <Plus className="h-12 w-12 text-white stroke-1"/>
                        <p className="text-sm text-white font-light">
                            New pitch
                        </p>
                    </button>
                </motion.button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle>Create a Pitch</DialogTitle>
                    <DialogDescription>
                        Upload your audio, text file, or write your pitch directly.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pitchName"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                placeholder="Name of your pitch"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contentType"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="contentType">Content Type</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setFiles([]);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
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
                                    </div>
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
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    className="min-h-[200px] resize-none"
                                                    placeholder="Enter your pitch text here..."
                                                    {...field}
                                                    required={form.watch("contentType") === "text"}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </AnimatePresence>

                        <DialogFooter>
                            <div className="flex w-full justify-between">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={pending || !form.formState.isValid}
                                    className="bg-gradient-to-b from-blue-500 to-blue-600"
                                >
                                    {pending ? "Adding..." : "Add Pitch"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
