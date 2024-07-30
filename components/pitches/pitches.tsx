import React from 'react'
import {Doc} from "@/convex/_generated/dataModel";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {FaCircle} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {TableBody, TableCell, TableRow} from "@/components/ui/table";

export const Pitches = ({data}: { data: Doc<"pitches"> }) => {
    return (
        <div key={data._id}>
            {/*<Dialog>*/}
            {/*    <div className="flex gap-2 items-center justify-end w-full">*/}
            {/*        <div className="flex gap-2 w-full">*/}
            {/*            <FaCircle className=" w-4 h-4 rounded-xl"/>*/}
            {/*            <DialogTrigger asChild>*/}
            {/*                <div className="flex flex-col items-start">*/}
            {/*                    <button className="text-sm font-normal text-left">*/}
            {/*                        {data.name}*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </DialogTrigger>*/}
            {/*        </div>*/}
            {/*        <DialogContent className="sm:max-w-md">*/}
            {/*            /!*<DialogHeader>*!/*/}
            {/*            /!*    <DialogTitle>{data.name}</DialogTitle>*!/*/}
            {/*            /!*</DialogHeader>*!/*/}
            {/*            /!*<div className="flex items-center space-x-2">*!/*/}
            {/*            /!*    <DialogDescription>*!/*/}
            {/*            /!*        {data.evaluation}*!/*/}
            {/*            /!*    </DialogDescription>*!/*/}
            {/*            /!*</div>*!/*/}
            {/*            /!*<DialogFooter className="sm:justify-start">*!/*/}
            {/*            /!*    <DialogClose asChild>*!/*/}
            {/*            /!*        <Button type="button" variant="secondary">*!/*/}
            {/*            /!*            Close*!/*/}
            {/*            /!*        </Button>*!/*/}
            {/*            /!*    </DialogClose>*!/*/}
            {/*            /!*</DialogFooter>*!/*/}
            {/*            <h3>{data.name}</h3>*/}
            {/*            <p>{data.text}</p>*/}
            {/*            <div>*/}
            {/*                {data.evaluation.map(({criteria, comment, score}, index) => (*/}
            {/*                    <div key={index}>*/}
            {/*                        <h4>{criteria}</h4>*/}
            {/*                        <p>{comment}</p>*/}
            {/*                        <p>Score: {score}</p>*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        </DialogContent>*/}
            {/*    </div>*/}
            {/*</Dialog>*/}


                <TableRow>
                    <TableCell className="font-medium">{data.name}</TableCell>
                    <TableCell>{"See more"}</TableCell>
                    <TableCell>{5}</TableCell>
                    <TableCell>{data._creationTime}</TableCell>
                </TableRow>

        </div>
    )
}

export default Pitches;