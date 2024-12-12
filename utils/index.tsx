
export function fileToText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject('Failed to read file as text.');
            }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}


export const getShortCriteriaName = (criteria: string) => {
    switch (criteria) {
        case "Problem-Solution Fit":
            return "Soundness";
        case "Business Potential":
            return "Potential";
        case "Presentation Quality":
            return "Presentation Quality";
        default:
            return criteria;
    }
}

export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'});
}
