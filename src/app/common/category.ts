export class Category {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public nameAr: string,
    public descriptionAr: string,
    public imageUrl?: string
  ) {}
}
