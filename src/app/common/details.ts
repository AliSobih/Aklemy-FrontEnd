export class Details {
  constructor(
    public note: string,
    public noteAr: string,
    public id?: number,
    public isDeleted?: boolean,
    public descriptionId?: number
  ) {}
}

// export interface Details {
//   note: string;
//   noteAr: string;
//   id?: number;
//   isDeleted?: boolean;
//   descriptionId?: number;
// }
