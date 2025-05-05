export interface Nationality {
  courseId: number;
  name: string;
  currency: string;
  factor: number;
  nameAr: string;
  currencyAr: string;
  countryCode: string;
  rateExchange: number;
  id: number | undefined;
  isDeleted?: boolean;
}
