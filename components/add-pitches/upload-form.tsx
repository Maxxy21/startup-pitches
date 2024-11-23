import {useForm} from "react-hook-form";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDropzone} from "react-dropzone";
import {toast} from "sonner";
import {z} from "zod";

import {Form, FormField, FormItem, FormControl, FormMessage} from "@/components/ui/form";
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Dropzone} from "@/components/add-pitches/dropzone";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {FormSchema} from "@/components/add-pitches/form-schema";

;
import {api} from "@/convex/_generated/api";
import {AnimatePresence} from "framer-motion";
import {evaluatePitch, transcribeAudio} from "@/actions/openai";
import {fileToText} from "@/utils";
import {Loader2} from "lucide-react";

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


export const UploadForm = () => {
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const {mutate, pending} = useApiMutation(api.pitches.createPitch);
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pitchTitle: "",
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
    //     const {pitchTitle, contentType, content} = data;
    //     let transcriptionText = contentType === 'text' ? content : "This is a dummy transcription for testing purposes...";
    //
    //     if (!transcriptionText) {
    //         throw new Error("No text content provided");
    //     }
    //
    //     const evaluationResults = mockEvaluation;
    //
    //     mutate({
    //         title: pitchTitle,
    //         text: transcriptionText,
    //         type: contentType,
    //         status: "evaluated",
    //         evaluation: evaluationResults,
    //         createdAt: Date.now(),
    //         updatedAt: Date.now(),
    //     })
    //         .then((id) => {
    //             toast.success("Pitch created");
    //             router.push(`/pitch/${id}`);
    //             setFiles([]);
    //             form.reset();
    //         })
    //         .catch(() => toast.error("Failed to create pitch"));
    // };



    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setIsProcessing(true); // Start processing
            const {pitchTitle, contentType, content} = data;
            let transcriptionText = "";

            if (contentType === 'text') {
                transcriptionText = content || "";
            } else if (files.length > 0) {
                if (contentType === 'audio') {
                    const formData = new FormData();
                    formData.append('audio', files[0]);
                    transcriptionText = await transcribeAudio(formData);
                } else if (contentType === 'textFile') {
                    transcriptionText = await fileToText(files[0]);
                }
            }
            if (!transcriptionText) {
                throw new Error("No text content provided");
            }

            const evaluationResults = await evaluatePitch(transcriptionText);

            await mutate({
                title: pitchTitle,
                text: transcriptionText,
                type: contentType,
                status: "evaluated",
                evaluation: evaluationResults,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            })
                .then((id) => {
                    toast.success("Pitch created");
                    router.push(`/pitch/${id}`);
                    setFiles([]);
                    form.reset();
                })
        } catch (error) {
            toast.error("Failed to create pitch");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="pitchTitle"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        placeholder="Title of your pitch"
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
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={pending || !form.formState.isValid || isProcessing}
                            className="bg-gradient-to-b from-blue-500 to-blue-600"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : pending ? (
                                "Adding..."
                            ) : (
                                "Add Pitch"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </form>
        </Form>
    );
};