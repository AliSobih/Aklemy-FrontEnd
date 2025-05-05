import { Question } from './question';

export interface Exam {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  questionsNumber: number;
  time: number;
  questions: Question[];
  courseId?: number;
  sectionId?: number;
  id?: number;
}
