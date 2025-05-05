export interface Review {
  courseId: number;
  userId: number;
  rating: number;
  comment: string;
  reviewDate?: Date;
  courseNameEn?: string;
  courseNameAr?: string;
  userName?: string;
  userPicture?: string;
  commentAr?: string;
  id?: number;
}
