import { Lesson } from './lesson';

export class Section {
  constructor(
    public title: string,
    public position: string,
    public titleAr: string,
    public lessons: Lesson[],
    public courseID?: string,
    public id?: number,
    public isDeleted?: boolean
  ) {}
}

// export interface Section {
//   title: string;
//   position: string;
//   titleAr: string;
//   lessons: Lesson[];
//   courseID?: string;
//   id?: number;
//   isDeleted?: boolean;
// }
