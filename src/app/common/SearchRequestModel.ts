import { Constants } from "./constants";

export class SearchRequestModel {
    searchValue?: string;
    sortDirection: string = Constants.ASC;
    sortBy: string | any;
    loggedInUserEmail?: string | null;
    isAdminUser?: Boolean | null;
  }
  