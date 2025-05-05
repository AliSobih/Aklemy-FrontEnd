import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchTerm: string, field: string): any[] {
    if (!value || !searchTerm) {
      return value; // Return original array if there's no search term
    }

    searchTerm = searchTerm.toLowerCase();
    return value.filter((item) =>
      item[field].toLowerCase().includes(searchTerm)
    );
  }
}
