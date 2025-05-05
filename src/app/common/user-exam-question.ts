import { UserExamAnswer } from './user-exam-answer';
import { UserExamDragAndDrop } from './user-exam-drag-and-drop';

export interface UserExamQuestion {
  id: number;
  questionText: string;
  questionTextAr: string;
  status: string;
  isCorrect?: boolean;
  tag?: boolean;
  questionId: number;
  userExamId?: number;
  imagePath: string;
  userExamAnswers: UserExamAnswer[];
  userExamDragAndDrops: UserExamDragAndDrop[];
}
