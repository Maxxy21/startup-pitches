import React from 'react';
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import ModeToggle from "@/components/mode-toggle";

const PitchDetailsHeader = () => {
    return (
        <header
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1"/>
                <Separator orientation="vertical" className="mr-2 h-4"/>
                <h1 className="text-2xl font-semibold">Pitch Perfect</h1>
            </div>
            <ModeToggle/>
        </header>
    );
};

export default PitchDetailsHeader;