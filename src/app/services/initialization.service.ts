import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class InitializationService {
  constructor() {}

  getUserCountry(): Promise<string> {
    return fetch(Constants.NATIONALITY_GET_COUNTRY_API)
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse.ip, jsonResponse.country);
        return jsonResponse.country;
      });
  }
}
