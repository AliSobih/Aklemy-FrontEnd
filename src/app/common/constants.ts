import { environment } from '../environments/environment';

// import { environment } from 'app/environments/environment.prod';

export class Constants {
  // Security Url
  public static readonly SECURITY_REGISTRATION_SIGNUP_API =
    environment.baseURL + '/registration';
  public static readonly SECURITY_REGISTRATION_CONFIRM_API =
    this.SECURITY_REGISTRATION_SIGNUP_API + '/confirm';
  public static readonly SECURITY_LOGIN_API = environment.baseURL + '/login';
  public static readonly SECURITY_LOGIN_SIGNIN_API =
    this.SECURITY_LOGIN_API + '/sign-in';
  public static readonly SECURITY_CREATE_RESET_PASSWORD_TOKEN_API =
    this.SECURITY_LOGIN_API + '/create-reset-password-token';
  public static readonly SECURITY_CONFORM_RESET_PASSWORD_TOKEN =
    this.SECURITY_LOGIN_API + '/conform-reset-password-token';
  public static readonly SECURITY_RESET_PASSWORD_TOKEN =
    this.SECURITY_LOGIN_API + '/reset-password';
  public static readonly SECURITY_CHANGE_PASSWORD =
    environment.baseURL + '/users/changePassword';

  // Category APIs
  public static readonly CATEGORY_API = environment.baseURL + '/categories';
  public static readonly CATEGORY_ALL_API = this.CATEGORY_API + '/all';
  public static readonly CATEGORY_PAGE_API = this.CATEGORY_API + '/datapage';
  public static readonly CATEGORY_ADD_API = this.CATEGORY_API + '/add';
  public static readonly CATEGORY_DELETE_API = this.CATEGORY_API + '/delete/';
  public static readonly CATEGORY_UPDATE_API = this.CATEGORY_API + '/update/';
  public static readonly CATEGORY_UPLOAD_IMAGE =
    this.CATEGORY_API + '/uploadImage';
  public static readonly CATEGORY_DOWNLOAD_IMAGE =
    this.CATEGORY_API + '/downloadImage/';
  //Review APIs
  public static readonly REVIEW_API = environment.baseURL + '/reviews';
  public static readonly REVIEW_ALLDATA_API = this.REVIEW_API + '/all';

  public static readonly REVIEW_ALL_API = this.REVIEW_API + '/course/';
  public static readonly REVIEW_PAGE_API = this.REVIEW_API + '/datapage';
  public static readonly REVIEW_ADD_API = this.REVIEW_API + '/add';
  public static readonly REVIEW_DELETE_API = this.REVIEW_API + '/delete/';
  public static readonly REVIEW_UPDATE_API = this.REVIEW_API + '/update/';

  // Course APIs
  public static readonly COURSE_API = environment.baseURL + '/courses';
  public static readonly COURSE_ALL_API = this.COURSE_API + '/all/';
  public static readonly COURSE_PAGE_API = this.COURSE_API + '/datapage/';
  public static readonly COURSE_ADD_API = this.COURSE_API + '/add';
  public static readonly COURSE_DELETE_API = this.COURSE_API + '/delete/';
  public static readonly COURSE_SOFT_DELETE_API =
    this.COURSE_API + '/softDelete/';

  public static readonly COURSE_UPDATE_API = this.COURSE_API + '/update/';
  public static readonly COURSE_SEARCH_API = this.COURSE_API + '/search/';
  public static readonly COURSE_FILTER_API = this.COURSE_API + '/filter/';

  public static readonly COURSE_UPLOAD_IMAGE_API =
    this.COURSE_API + '/uploadImage';
  public static readonly COURSE_DOWNLOAD_IMAGE_API =
    this.COURSE_API + '/downloadImage/';
  public static readonly COURSE_DOWNLOAD_VIDEO_API =
    this.COURSE_API + '/downloadVideo/';
  public static readonly COURSE_DOWNLOAD_PDF_API =
    this.COURSE_API + '/downloadPdf/';
  public static readonly COURSE_UPLOAD_VEDIO_API =
    this.COURSE_API + '/uploadVideo';

  public static readonly COURSE_CATEGORY_API = this.COURSE_API + '/category/';
  //Exam APIs
  public static readonly EXAM_API = environment.baseURL + '/exams';
  public static readonly EXAM_ALL_EXAMS_API = this.EXAM_API + '/allExams/';

  public static readonly EXAM_All_curse_API = this.EXAM_API + '/courseExams/';
  public static readonly EXAM_Section_API = this.EXAM_API + '/courseExam/';

  public static readonly EXAM_curse_API = this.EXAM_API + '/courseExam/';

  public static readonly EXAM_ALL_API = this.EXAM_API + '/all/';
  public static readonly EXAM_PAGE_API = this.EXAM_API + '/datapage/';

  public static readonly EXAM_ADD_API = this.EXAM_API + '/add';
  public static readonly EXAM_DELETE_API = this.EXAM_API + '/delete/';
  public static readonly EXAM_UPDATE_API = this.EXAM_API + '/update/';
  public static readonly EXAM_COURSE_API = this.EXAM_API + '/courseExam/';
  // User Exame APIs
  public static readonly USER_EXAM_API = environment.baseURL + '/userexams';
  public static readonly USER_STERT_EXAM_API =
    this.USER_EXAM_API + '/start_exam';
  public static readonly USER_MARK_EXAM_API =
    this.USER_EXAM_API + '/mark_exam/';
  public static readonly USER_PAUSE_EXAM_API = this.USER_EXAM_API + '/pause';
  // User Answer Apis
  public static readonly USER_EXAME_ANSWER__API =
    environment.baseURL + '/user_exam_answers';
  public static readonly USER_EXAME_ANSWER_UPDATE_USER_ANSWER_API =
    this.USER_EXAME_ANSWER__API + '/mark_answers';
  public static readonly USER_EXAM_CORRECT_ANWERS =
    this.USER_EXAME_ANSWER__API + '/getUserAnswers/';

  //Question APIs
  public static readonly QUESTION_API = environment.baseURL + '/questions';
  public static readonly QUESTION_ALL_API = this.QUESTION_API + '/all/';
  public static readonly QUESTION_ALL_by_Id_API =
    this.QUESTION_API + '/course/';
  public static readonly QUESTION_CORRECT_ANSWER_API =
    this.QUESTION_API + '/getCorrectAnswers/';
  public static readonly QUESTION_UPLOAD_IMAGE_API =
    this.QUESTION_API + '/uploadImage';
  public static readonly QUESTION_DOWNLOAD_IMAGE_API =
    this.QUESTION_API + '/downloadImage/';
  public static readonly QUESTION_PAGE_API = this.QUESTION_API + '/datapage/';
  public static readonly Question_SEARCH_API = this.QUESTION_API + '/search/';
  public static readonly QUESTION_ADD_API = this.QUESTION_API + '/add';
  public static readonly QUESTION_DELETE_API = this.QUESTION_API + '/delete/';
  public static readonly QUESTION_UPDATE_API = this.QUESTION_API + '/update/';

  // user exam question apis
  public static readonly USER_EXAM_QUESTION_API =
    environment.baseURL + '/user_exam_question';
  public static readonly USER_EXAM_QUESTION_TAG_API =
    this.USER_EXAM_QUESTION_API + '/tag';
  public static readonly USER_EXAM_QUESTION_UNTAG_API =
    this.USER_EXAM_QUESTION_API + '/untag';
  public static readonly USER_EXAM_QUESTION_ALL_TAG_API =
    this.USER_EXAM_QUESTION_API + '/all-tagged';

  // Drage and Drop Apis
  public static readonly DRAG_AND_DROP =
    environment.baseURL + '/user_exam_drag_and_drops';
  public static readonly DRAG_AND_DROP_MARK_DRAG_AND_DROPS =
    this.DRAG_AND_DROP + '/mark_drag_and_drops';
  public static readonly DRAG_AND_DROP_CORRECT_ANSWERS =
    this.DRAG_AND_DROP + '/getUserAnswers/';

  // Slider APIs
  public static readonly SLIDER_API = environment.baseURL + '/images';
  public static readonly SLIDER_UPLOAD_IMAGE_API = this.SLIDER_API + '/upload';
  public static readonly SLIDER_DOWNLOAD_ALL_IMAGE_API =
    this.SLIDER_API + '/getAllAds';
  public static readonly SLIDER_DELETE_IMAGE_API = this.SLIDER_API + '/delete/';
  public static readonly SLIDER_DOWNLOAD_IMAGE_AOI =
    this.SLIDER_API + '/downloadImage/';
  //certificate APIs
  public static readonly CERTIFICATE_API =
    environment.baseURL + '/certificates';
  public static readonly CERTIFICATE_USER_API =
    this.CERTIFICATE_API + '/getCertificate';
  //Teacher Request APIs
  public static readonly TEACHER_REQUEST_API =
    environment.baseURL + '/teachers_requests';
  public static readonly TEACHER_REQUEST_ALL_API =
    this.TEACHER_REQUEST_API + '/all';
  public static readonly TEACHER_REQUEST_PAGE_API =
    this.TEACHER_REQUEST_API + '/datapage';
  public static readonly TEACHER_REQUEST_ADD_API =
    this.TEACHER_REQUEST_API + '/add-teachers-request';
  public static readonly TEACHER_REQUEST_APPROVE_API =
    this.TEACHER_REQUEST_API + '/approve';

  //sections APIs
  public static readonly SECTION_API = environment.baseURL + '/sections';
  public static readonly SECTION_ALL_API = this.SECTION_API + '/all';
  public static readonly SECTION_PAGE_API = this.SECTION_API + '/datapage';
  public static readonly SECTION_ADD_API = this.SECTION_API + '/add';
  public static readonly SECTION_DELETE_API = this.SECTION_API + '/delete/';
  public static readonly SECTION_UPDATE_API = this.SECTION_API + '/update/';

  // Lesson APIs
  public static readonly LESSON_API = environment.baseURL + '/lessons';
  public static readonly LESSON_ALL_API = this.LESSON_API + '/all';
  public static readonly LESSON_PAGE_API = this.LESSON_API + '/datapage';
  public static readonly LESSON_ADD_API = this.LESSON_API + '/add';
  public static readonly LESSON_DELETE_API = this.LESSON_API + '/delete/';
  public static readonly LESSON_UPDATE_API = this.LESSON_API + '/update/';
  public static readonly Lesson_PATCH_API = this.LESSON_API + '/updateLesson/';
  //watched lesson APIs
  public static readonly WATCHED_LESSON_API =
    environment.baseURL + '/watched-lessons';
  public static readonly WATCHED_LESSON_ALL_API =
    this.WATCHED_LESSON_API + '/all';
  public static readonly WATCHED_COURSE_PER_API =
    this.WATCHED_LESSON_API + '/watched-per-course';
  public static readonly WATCHED_LESSON_ADD_API =
    this.WATCHED_LESSON_API + '/add';
  //Coupon APIs
  public static readonly COUPON_API = environment.baseURL + '/coupons';
  public static readonly COUPON_ALL_API = this.COUPON_API + '/all';
  public static readonly COUPON_PAGE_API = this.COUPON_API + '/datapage';
  public static readonly COUPON_ADD_API = this.COUPON_API + '/add';
  public static readonly COUPON_DELETE_API = this.COUPON_API + '/delete/';
  public static readonly COUPON_UPDATE_API = this.COUPON_API + '/update/';
  public static readonly COUPON_COURSE_API = this.COUPON_API + '/course/';

  //BasicInfo APIs
  public static readonly BASIC_INFO_API = environment.baseURL + '/basicInfo';
  public static readonly BASIC_INFO_ALL_API = this.BASIC_INFO_API + '/all';
  public static readonly BASIC_INFO_ADD_API = this.BASIC_INFO_API + '/add';
  public static readonly BASIC_INFO_UPDATE_API =
    this.BASIC_INFO_API + '/update/';

  // Nationality APIs
  public static readonly NATIONALITY_API =
    environment.baseURL + '/nationalities';
  public static readonly NATIONALITY_ALL_API = this.NATIONALITY_API + '/all';
  public static readonly NATIONALITY_PAGE_API =
    this.NATIONALITY_API + '/datapage';
  public static readonly NATIONALITY_ADD_API = this.NATIONALITY_API + '/add';
  public static readonly NATIONALITY_DELETE_API =
    this.NATIONALITY_API + '/delete/';
  public static readonly NATIONALITY_UPDATE_API =
    this.NATIONALITY_API + '/update/';
  public static readonly NATIONALITY_COURSE_API =
    this.NATIONALITY_API + '/course/';
  public static readonly NATIONALITY_COUNTRY_TOKEN = 'e4179167ee29c3';
  public static readonly NATIONALITY_GET_COUNTRY_API =
    'https://ipinfo.io/json?token=' + this.NATIONALITY_COUNTRY_TOKEN;

  // Description Master APIs
  public static readonly DESCRIPTION_MASTER_API =
    environment.baseURL + '/description_master';
  public static readonly DESCRIPTION_MASTER_ALL_API =
    this.DESCRIPTION_MASTER_API + '/all';
  public static readonly DESCRIPTION_MASTER_PAGE_API =
    this.DESCRIPTION_MASTER_API + '/datapage';
  public static readonly DESCRIPTION_MASTER_ADD_API =
    this.DESCRIPTION_MASTER_API + '/add';
  public static readonly DESCRIPTION_MASTER_DELETE_API =
    this.DESCRIPTION_MASTER_API + '/delete/';
  public static readonly DESCRIPTION_MASTER_UPDATE_API =
    this.DESCRIPTION_MASTER_API + '/update/';
  public static readonly DESCRIPTION_MASTER_COURSE_API =
    this.DESCRIPTION_MASTER_API + '/course/';

  // Description Details APIs
  public static readonly DESCRIPTION_DETAILS_API =
    environment.baseURL + '/description_detail';
  public static readonly DESCRIPTION_DETAILS_ALL_API =
    this.DESCRIPTION_DETAILS_API + '/all';
  public static readonly DESCRIPTION_DETAILS_PAGE_API =
    this.DESCRIPTION_DETAILS_API + '/datapage';
  public static readonly DESCRIPTION_DETAILS_ADD_API =
    this.DESCRIPTION_DETAILS_API + '/add';
  public static readonly DESCRIPTION_DETAILS_DELETE_API =
    this.DESCRIPTION_DETAILS_API + '/delete/';
  public static readonly DESCRIPTION_DETAILS_UPDATE_API =
    this.DESCRIPTION_DETAILS_API + '/update/';

  public static readonly ROLE_ADMIN = 'ROLE_ADMIN';
  public static readonly ROLE_TEACHER = 'ROLE_TEACHER';
  public static readonly ROLE_STUDENT = 'ROLE_STUDENT';

  // Enrollment APIs
  public static readonly ENROLLMENT_API = environment.baseURL + '/enrollments';
  public static readonly ENROLLMENT_ALL_API = this.ENROLLMENT_API + '/all';
  public static readonly ENROLLMENT_SEARCH_API =
    this.ENROLLMENT_API + '/search/';
  public static readonly ENROLLMENT_PAGE_API =
    this.ENROLLMENT_API + '/datapage';
  public static readonly ENROLLMENT_ADD_API = this.ENROLLMENT_API + '/add';
  public static readonly ENROLLMENT_DELETE_API =
    this.ENROLLMENT_API + '/delete/';
  public static readonly ENROLLMENT_UPDATE_API =
    this.ENROLLMENT_API + '/update/';
  public static readonly ENROLLMENT_ALL_BY_USER_ID_API =
    this.ENROLLMENT_API + '/user/';
  public static readonly ENROLLMENT_COURSE_BY_USER_ID =
    this.ENROLLMENT_API + '/course';
  public static readonly ENROLLMENT_APPROVE_ENROLMENT_API =
    this.ENROLLMENT_API + '/approve';
  // Sort
  public static readonly ASC = 'ASC';
  public static readonly DESC = 'DESC';
  public static readonly sortASCIcon = 'arrow_upward';
  public static readonly sortDESCIcon = 'arrow_downward';
  public static readonly sortASCHint = 'Sort Ascending';
  public static readonly sortDescHint = 'Sort Descending';

  /* Validation Regex */
  public static readonly ENGLISH_CHARACTERS = '^[a-zA-Z ]+$';
  public static readonly ARABIC_CHARACTERS = '^[\\u0621-\\u064A ]+$';
  public static readonly DIGITS_ONLY_14 = '^[0-9]{14}$';
  public static readonly DIGITS_ONLY_11 = '^[01][0-9]{10}$';
  public static readonly FLOAT_NUMBERS = '^([0-9]*[.])?[0-9]+$';
  public static readonly DIGITS_ONLY = '^\\d+$';
  public static readonly ENGLISH_CHARACTERS_AND_DIGITS = '^[a-zA-Z0-9 ]+$';
  public static readonly ENGLISH_CHARACTERS_AND_DIGITS_AND_DASH =
    '^[a-zA-Z0-9- ]*$';
  public static readonly FORM_DATA_VALUE = 'multipart/form-data';
  public static readonly APP_JSON = 'application/json';
}
