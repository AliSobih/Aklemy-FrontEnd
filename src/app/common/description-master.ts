import { Course } from './course';
import { Details } from './details';

export class DescriptionMaster {
  constructor(
    public courseId: number,
    public note: string,
    public noteAr: string,
    public details: Details[],
    public id?: number,
    public isDeleted?: boolean
  ) {}
}

// export interface DescriptionMaster {
//   courseId: number;
//   note: string;
//   noteAr: string;
//   details: Details[];
//   id?: number;
//   isDeleted?: boolean;
// }

