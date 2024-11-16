import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Search, SearchIcon} from "lucide-react";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const searchFormSchema = z.object({
    searchText: z.string().min(1, "Please enter a search term"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const SearchForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
            searchText: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: SearchFormValues) => {
        try {
            setIsLoading(true);
            router.push(`/dashboard/search/${encodeURIComponent(values.searchText)}`);
        } catch (error) {
            console.error("Search error:", error);
            //TODO: Show error message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex items-center justify-center max-w-2xl mx-auto"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="relative flex gap-2 items-center w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <FormField
                        control={form.control}
                        name="searchText"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        type="search"
                                        placeholder="Search..."
                                        className="w-full appearance-none pl-8 shadow-none h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                        disabled={isLoading || form.formState.isSubmitting}
                    >
                        {isLoading ? (
                            <div
                                className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                        ) : (
                            <SearchIcon className="h-4 w-4"/>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default SearchForm;