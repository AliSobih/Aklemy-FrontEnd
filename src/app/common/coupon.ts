export interface Coupon {
  code: string;

  discountPercentage: number;
  validFrom: Date;
  validTo: Date;

  isActive?: boolean;
  courseId: number;
  id?: number;
}
