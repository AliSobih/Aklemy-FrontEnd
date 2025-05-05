import { SafeUrl } from '@angular/platform-browser';
import { DescriptionMaster } from './description-master';
import { Section } from './section';

export class Course {
  public imageDownload: SafeUrl | undefined;
  constructor(
    public title: string,
    public description: string,
    public language: string,
    public price: number,
    public fixedPrice: number,
    public categoryId: number,
    public userId: number,
    public titleAr: string,
    public descriptionAr: string,
    public imageURL: string,
    public sections: Section[],
    public descriptionMasterDTOS?: DescriptionMaster[],
    public id?: number,
    public updatedDate?: string,
    public formattedAmountEnBeforeDiscount?: string,
    public formattedAmountArBeforeDiscount?: string,
    public instructorNameEn?: string,
    public instructorNameAr?: string,
    public enrollmentsNum?: number,
    public reviewsNum?: number,
    public averageRating?: number,
    public formattedAmountAr?: string,
    public formattedAmountEn?: string,
    public totalHours?: string,
    public pdfCount?: number,
    public isDeleted?: boolean,
    public isWatched?: boolean,
    public ratingCounts?: Array<number>,
  ) {}
}
// export interface Course {
//   imageDownload: SafeUrl | undefined;

//   title: string;
//   description: string;
//   language: string;
//   price: number;
//   categoryId: number;
//   userId: number;
//   titleAr: string;
//   descriptionAr: string;
//   imageURL: string;
//   sections: Section[];
//   descriptionMasterDTOS?: DescriptionMaster[];
//   id?: number;
//   updatedDate?: string;

//   fixedPrice?: number;
//   instructorNameEn?: string;
//   instructorNameAr?: string;
//   enrollmentsNum?: number;
//   reviewsNum?: number;
//   formattedAmountAr?: string;
//   formattedAmountEn?: string;
//   isDeleted?: boolean;
// }
