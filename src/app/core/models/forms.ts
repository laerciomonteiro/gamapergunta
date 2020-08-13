export interface Forms {
    created_at: string;
    id: number;
    published: number;
    questions: {
        id: number;
        title: string;
        position: number;
        options: {
            id: number;
            type: string;
            field: string;
            position: number;
        }
    };
    title: string;
}
