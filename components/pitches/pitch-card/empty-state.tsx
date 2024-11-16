import { motion } from 'framer-motion';

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-175px)]">
            <div className="bg-muted p-8 rounded-lg text-center max-w-md">
                <h3 className="text-lg font-medium mb-2">No pitches found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first pitch
                </p>
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="text-3xl mb-2">↑</div>
                </motion.div>
                <p className="text-sm text-muted-foreground">
                    Click the Add Pitch button above
                </p>
            </div>
        </div>
    );
};