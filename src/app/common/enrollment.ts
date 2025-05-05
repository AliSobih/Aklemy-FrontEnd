import { Course } from './course';

export class Enrollment {
  constructor(
    public course: Course,
    public enrollmentDate: string,
    public studentId: number,
    public studentNameAr?: string,
    public studentName?: string,
    public approve?: boolean,
    public id?: number
  ) {}
}
