export type TOption = {
    id: number;
    text: string;
}

export type TQuestion = {
    id: number;
    question: string;
    options: TOption[];
    correctAnswerId: number;
}