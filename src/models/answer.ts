export type  TAnswer = {
  timestamp: number;
  selectedOptionId: number;
  userId: number;
  userName: string;
  isCorrect: boolean;
}

export type TAnswerHistory = {
  questionId: number;
  answers: TAnswer[];
}