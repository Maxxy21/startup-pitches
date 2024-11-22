// form-schema.ts
import {z} from "zod";

export const FormSchema = z.object({
    pitchTitle: z.string().min(2, {
        message: "Pitch title must be at least 2 characters.",
    }),
    contentType: z.enum(['audio', 'textFile', 'text']),
    content: z.string().optional(),
    file: z.any().optional(),
});