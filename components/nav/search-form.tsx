import React from 'react'
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {Search, SearchIcon} from "lucide-react";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const SearchForm = () => {
    const form = useForm();
    const router = useRouter();

    const onSubmit = async ({searchText}: any) => {
        console.log("submitted", {searchText});
        router.push(`/dashboard/search/${searchText}`);
    };

    return (
        <Form {...form}>
            <form
                className="flex items-center justify-center max-w-2xl mx-auto"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="relative flex gap-2 items-center w-full ">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground "/>
                    <FormField
                        control={form.control}
                        name="searchText"
                        render={({field}) => (
                            <FormItem className="w-full focus">
                                <FormControl>
                                    <Input
                                        id="searchText"
                                        type="search"
                                        required
                                        placeholder="Search..."
                                        className="w-full appearance-none pl-8 shadow-none h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="hover:bg- px-4 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
                        <SearchIcon className="h-4 w-4"/>
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default SearchForm
