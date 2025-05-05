export class Certificate {
  courseId?: number;
  studentId?: number;
  issuedDate?: Date;
  certificateURL?: string;
  enrollmentId?: number;
  courseName?: string;
  courseNameAr?: string;
  instructorName?: string;
  instructorNameAr?: string;
  totalHours?: number;
  studentName?: string;
  studentNameAr?: string;
  constructor(courseId: number, studentId: number) {
    this.courseId = courseId;
    this.studentId = studentId;

  }
}
