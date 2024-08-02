"use client"
import React, {Dispatch, SetStateAction} from 'react'

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
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
import {evaluatePitch, transcribeAudio} from "@/actions/openai";
import {fileToText} from "@/utils";

const FormSchema = z.object({
    pitchName: z.string().min(2, {
        message: "Pitch name must be at least 2 characters.",
    }),
    contentType: z.enum(['audio', 'textFile', 'text']),
    content: z.string().optional(),
    file: z.any().optional(),
})


const AddPitchInline = ({
                            setShowAddPitch,
                        }: {
    setShowAddPitch: Dispatch<SetStateAction<boolean>>;
}) => {
    const createPitchEmbeddings = useAction(api.pitches.createPitchEmbeddings);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pitchName: "",
            contentType: "audio",
            content: "",
            file: null,
        }
    })

    const fileRef = form.register("file");


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const {pitchName, contentType, content, file} = data;
        let transcriptionText = content || "";

        if (contentType === 'audio' && file instanceof FileList) {
            const audioFile = file[0];
            const formData = new FormData();
            formData.append('audio', audioFile);
            transcriptionText = await transcribeAudio(formData);
        } else if (contentType === 'textFile' && file instanceof FileList) {
            transcriptionText = await fileToText(file[0]);
        }

        const evaluationResults = await evaluatePitch(transcriptionText);

        await createPitchEmbeddings({
            name: pitchName,
            text: transcriptionText,
            evaluation: evaluationResults
        });

        form.resetField("pitchName");
        form.resetField("content");
        form.resetField("file");
    }


    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20 w-5/6">
                    <FormField
                        control={form.control}
                        name="pitchName"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        id="pitchName"
                                        placeholder="Enter your pitch name"
                                        required
                                        className="border-0 font-semibold text-lg"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2">
                        <FormField
                            control={form.control}
                            name="contentType"
                            render={({field}) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        {(form.getValues("contentType") === 'audio')
                            &&
                            (
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            placeholder="file"
                                                            accept="audio/*"
                                                            {...fileRef
                                                            } />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            )}

                        {(form.getValues("contentType") === 'textFile')
                            &&
                            (
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({field}) => {
                                            return (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="file"
                                                            placeholder="file"
                                                            accept=".txt"
                                                            {...fileRef} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </div>
                            )}

                    </div>

                    {(form.getValues("contentType") === 'text') && (
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-start gap-2">
                                            <Textarea
                                                id="content"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}


                    <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
                        <div className="w-full lg:w-1/4"></div>
                        <div className="flex gap-3 self-end">
                            <Button className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                                    variant="outline"
                                    type="submit"
                                    onClick={() => setShowAddPitch(false)}
                            >
                                Cancel
                            </Button>
                            <Button className="px-6" type="submit">
                                Add Pitch
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>

        </div>
    )
}
export default AddPitchInline
