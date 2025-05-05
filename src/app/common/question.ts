import { SafeUrl } from '@angular/platform-browser';
import { Answer } from './answer';
import { DragAndDrop } from './drag-and-drop';

export interface Question {
  imageDownload: SafeUrl | undefined;

  courseId?: number;
  question: string;
  questionAr: string;
  level: string;
  subject: string;
  status: string;
  chapter: string;
  imagePath: string;

  answers?: Answer[];
  dragAndDrops?: DragAndDrop[];
  id?: number;
}
