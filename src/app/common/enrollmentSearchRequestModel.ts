import { SearchRequestModel } from './SearchRequestModel';

export class EnrollmentSearchRequestModel extends SearchRequestModel {
  enrollmentDateFrom?: Date | null;
  enrollmentDateTo?: Date | null;
}
