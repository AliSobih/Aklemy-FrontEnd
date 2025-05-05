import { UserExamQuestion } from './user-exam-question';

export interface UserExam {
  id?: number;
  examId?: number;
  userId?: number;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  wrongAnswers?: number;
  correctAnswers?: number;
  remainingTime?: number;
  time?: number;
  netTime?: number;
  language?: string;
  status?: boolean;
  userExamQuestions?: UserExamQuestion[];
}
