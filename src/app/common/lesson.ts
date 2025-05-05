export class Lesson {
  constructor(
    public title: string,
    public contentType: string,
    public contentURL: string,
    public duration: number,
    public position: number,
    public isVisible: boolean,
    public titleAr: string,
    public contentTypeAr: string,
    public sectionId?: string,
    public id?: number,
    public isDeleted?: boolean,
    public watched?: boolean
  ) {}
}
// export interface Lesson {
//   title: string;
//   contentType: string;
//   contentURL: string;
//   duration: number;
//   position: number;
//   isVisible: boolean;
//   titleAr: string;
//   contentTypeAr: string;
//   sectionId?: string;
//   id?: number;
//   isDeleted?: boolean;
// }
