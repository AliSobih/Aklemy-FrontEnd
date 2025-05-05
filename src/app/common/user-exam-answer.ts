export interface UserExamAnswer {
  id: number;
  answer: string;
  answerAr: string;
  mark?: boolean;
  isCorrect?: boolean;
  userExamQuestionId?: number;
}
