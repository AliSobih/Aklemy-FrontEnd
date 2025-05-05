import { Course } from './course';
import { Enrollment } from './enrollment';

export class User {
  id: number = 0;
  name?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  dateJoined?: Date;
  enabled?: boolean;
  courses?: Course[];
  enrollments?: Enrollment[];

  //TODO: for arabic
  nameAr?: string;
  roleAr?: string;

  constructor() {
    let user = sessionStorage.getItem('authUser');
    if (user == null || user == undefined) {
      user = localStorage.getItem('authUser');
    }

    if (user) {
      const userData = JSON.parse(user); // فك تشفير الـ JWT token
      this.id = userData.id;
      this.name = userData.name;
      this.email = userData.email;
      this.role = userData.role;
      this.profilePicture = userData.profilePicture;
      this.dateJoined = userData.dateJoined;
      this.enabled = userData.enabled;
      this.courses = userData.courses;
      this.enrollments = userData.enrollments;
    }
    // else {
    //   throw new Error('No auth token found in session storage');
    // }

    // this.id = userData.;
    // // this.name = 'Ali Fathy';
    // // this.nameAr = 'على فتحى';
  }
}
