// app-routing.module.ts

import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '@core/page-not-found/page-not-found.component';
import { directionGuard } from './Guards/direction.guard';
import { unsavedChangesGuard } from './services/unsaved-changes.guard';
import { SignUpComponent } from './security/sign-up/sign-up.component';
import { LoginComponent } from './security/login/login.component';
import { ConfirmEmailComponent } from './security/confirm-email/confirm-email.component';
import { CreateResetPasswordTokenComponent } from './security/create-reset-password-token/create-reset-password-token.component';
import { ForgotPasswordComponent } from './security/forgot-password/forgot-password.component';
import { authGuard } from './Guards/auth.guard';
import { Constants } from '@common/constants';

// const rolesAll = [
//   Constants.ROLE_ADMIN,
//   Constants.ROLE_TEACHER,
//   Constants.ROLE_STUDENT,
// ];
// const roleAdmin = [Constants.ROLE_ADMIN];
// const roleTeacherAdmin = [Constants.ROLE_TEACHER, Constants.ROLE_ADMIN];
const rolesAll = ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'];
const roleAdmin = ['ROLE_ADMIN'];
const roleTeacherAdmin = ['ROLE_TEACHER'];

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home-page/home-page.component').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/card-details.component'
          ).then((m) => m.CardDetailsComponent),
      },
      {
        path: 'myLearning',
        loadComponent: () =>
          import('./components/home/my-learning/my-learning.component').then(
            (m) => m.MyLearningComponent
          ),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'course/:id',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/course-explanation.component'
          ).then((m) => m.CourseExplanationComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'course/:id/certificate',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/certificate/certificate.component'
          ).then((m) => m.CertificateComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'ShoppingCart',
        loadComponent: () =>
          import(
            './components/home/shopping-cart/shopping-cart.component'
          ).then((m) => m.ShoppingCartComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'CourseVideo/:id',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/course-explanation.component'
          ).then((m) => m.CourseExplanationComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'CoursePreview/:id',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-preview/course-preview.component'
          ).then((m) => m.CoursePreviewComponent),
      },
      {
        path: 'result/:total',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/exame/exam-result/exam-result.component'
          ).then((m) => m.ExamResultComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'join-us',
        loadComponent: () =>
          import(
            './components/home/add-teacher-request/add-teacher-request.component'
          ).then((m) => m.AddTeacherRequestComponent),
      },
      {
        path: 'category-name/:id',
        loadComponent: () =>
          import(
            './components/home/home-page/category-page/category-page.component'
          ).then((m) => m.CategoryPageComponent),
      },
    ],
  },
  {
    path: 'courseExams/:id',
    loadComponent: () =>
      import(
        './components/home/home-page/courses/card-details/course-explanation/exame/exam-table/exam-table.component'
      ).then((m) => m.ExamTableComponent),
    canActivate: [authGuard],
    data: { role: rolesAll },
    children: [
      {
        path: 'exam/:examId',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/exame/exame.component'
          ).then((m) => m.ExameComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'result/:total/:examId',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/exame/exam-result/exam-result.component'
          ).then((m) => m.ExamResultComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
    ],
  },
  {
    path: 'ExamSections/:id/:idExamSections',
    loadComponent: () =>
      import(
        './components/home/home-page/courses/card-details/course-explanation/exame/exam-table/exam-table.component'
      ).then((m) => m.ExamTableComponent),
    canActivate: [authGuard],
    data: { role: rolesAll },
    children: [
      {
        path: 'exam/:examId/:examId',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/exame/exame.component'
          ).then((m) => m.ExameComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
      {
        path: 'result/:total',
        loadComponent: () =>
          import(
            './components/home/home-page/courses/card-details/course-explanation/exame/exam-result/exam-result.component'
          ).then((m) => m.ExamResultComponent),
        canActivate: [authGuard],
        data: { role: rolesAll },
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
    canActivate: [authGuard],
    data: { role: roleAdmin },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/admin/category/category.component').then(
            (m) => m.CategoryComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./components/admin/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'basic-info',
        loadComponent: () =>
          import('./components/admin/basic-info/basic-info.component').then(
            (m) => m.BasicInfoComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'slider',
        loadComponent: () =>
          import('./components/admin/slider/slider.component').then(
            (m) => m.SliderComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'teacher-request',
        loadComponent: () =>
          import(
            './components/admin/teacher-request/teacher-request.component'
          ).then((m) => m.TeacherRequestComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./components/teacher/course/course.component').then(
            (m) => m.CourseComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'enrollment',
        loadComponent: () =>
          import('./components/admin/enrollments/enrollments.component').then(
            (m) => m.EnrollmentsComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/add-course',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-course.component'
          ).then((m) => m.AddCourseComponent),
        canDeactivate: [unsavedChangesGuard],
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/update-course/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-course.component'
          ).then((m) => m.AddCourseComponent),
        canDeactivate: [unsavedChangesGuard],
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/description_master/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/description-master/description-master.component'
          ).then((m) => m.DescriptionMasterComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/nationality/:id/:price',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/nationality-course/nationality-course.component'
          ).then((m) => m.NationalityCourseComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/coupon/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/coupon/coupon.component'
          ).then((m) => m.CouponComponent),
        canActivate: [authGuard],
        data: { role: 'ROLE_ADMIN' },
      },
      {
        path: 'courses/view-course/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/details-course/details-course.component'
          ).then((m) => m.DetailsCourseComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/review-table/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/review-table/review-table.component'
          ).then((m) => m.ReviewTableComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/view-course/:courseId/:lessonId',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-video/add-video.component'
          ).then((m) => m.AddVideoComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/Exam/:id',
        loadComponent: () =>
          import('./components/teacher/course/add-exam/exam.component').then(
            (m) => m.ExamComponent
          ),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/addExamCourse/:idCourse',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/updetExamCourse/:idCourse/:idUpdetExam',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/addExamSections/:idCourse/:idExamSections',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/updeteExamSections/:idCourse/:idExamSections/:idUpdetExam',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/addQuestion/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-question/add-question.component'
          ).then((m) => m.AddQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/updeteQuestion/:id/:idupdet',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-question/add-question.component'
          ).then((m) => m.AddQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/viewExamSections/:idCourse/:idExamSections',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-exam/view-exam.component'
          ).then((m) => m.ViewExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/viewExamCourse/:idCourse',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-exam/view-exam.component'
          ).then((m) => m.ViewExamComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
      {
        path: 'courses/viewQuestion/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-question/view-question.component'
          ).then((m) => m.ViewQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleAdmin },
      },
    ],
  },
  {
    path: 'teacher',
    loadComponent: () =>
      import('./components/teacher/teacher.component').then(
        (m) => m.TeacherComponent
      ),
    canActivate: [authGuard],
    data: { role: roleTeacherAdmin },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/teacher/course/course.component').then(
            (m) => m.CourseComponent
          ),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'enrollment',
        loadComponent: () =>
          import('./components/admin/enrollments/enrollments.component').then(
            (m) => m.EnrollmentsComponent
          ),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'add-course',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-course.component'
          ).then((m) => m.AddCourseComponent),
        canDeactivate: [unsavedChangesGuard],
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'update-course/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-course.component'
          ).then((m) => m.AddCourseComponent),
        canDeactivate: [unsavedChangesGuard],
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'description_master/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/description-master/description-master.component'
          ).then((m) => m.DescriptionMasterComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'nationality/:id/:price',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/nationality-course/nationality-course.component'
          ).then((m) => m.NationalityCourseComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'coupon/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/coupon/coupon.component'
          ).then((m) => m.CouponComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'view-course/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/details-course/details-course.component'
          ).then((m) => m.DetailsCourseComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'review-table/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/review-table/review-table.component'
          ).then((m) => m.ReviewTableComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'video/:courseId/:lessonId',
        loadComponent: () =>
          import(
            './components/teacher/course/add-course/add-video/add-video.component'
          ).then((m) => m.AddVideoComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'Exam/:id',
        loadComponent: () =>
          import('./components/teacher/course/add-exam/exam.component').then(
            (m) => m.ExamComponent
          ),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'addExamCourse/:idCourse',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'updetExamCourse/:idCourse/:idUpdetExam',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'addExamSections/:idCourse/:idExamSections',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'updeteExamSections/:idCourse/:idExamSections/:idUpdetExam',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-exam/add-exam.component'
          ).then((m) => m.AddExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'addQuestion/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-question/add-question.component'
          ).then((m) => m.AddQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'updeteQuestion/:id/:idupdet',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/add-question/add-question.component'
          ).then((m) => m.AddQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'viewExamSections/:idCourse/:idExamSections',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-exam/view-exam.component'
          ).then((m) => m.ViewExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'viewExamCourse/:idCourse',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-exam/view-exam.component'
          ).then((m) => m.ViewExamComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
      {
        path: 'viewQuestion/:id',
        loadComponent: () =>
          import(
            './components/teacher/course/add-exam/view-question/view-question.component'
          ).then((m) => m.ViewQuestionComponent),
        canActivate: [authGuard],
        data: { role: roleTeacherAdmin },
      },
    ],
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'Confirm-email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'send-reset-password-email',
    component: CreateResetPasswordTokenComponent,
  },
  {
    path: 'reset-password',
    component: ForgotPasswordComponent,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];
