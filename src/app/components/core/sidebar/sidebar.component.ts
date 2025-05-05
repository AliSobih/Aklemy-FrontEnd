import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private router: Router) {}

  openHome() {
    this.router.navigate(['home']);
  }
  openCategory() {
    this.router.navigate(['admin']);
  }
  openCourse() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses']);
    } else {
      this.router.navigate(['teacher']);
    }
  }
  openSlider() {
    this.router.navigate(['admin/slider']);
  }
  openEnrollment() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/enrollment']);
    } else {
      this.router.navigate(['teacher/enrollment']);
    }
  }
  onTeacherRequest() {
    this.router.navigate(['admin/teacher-request']);
  }

  onBasicInfo() {
    this.router.navigate(['admin/basic-info']);
  }

  isAdmin(): boolean {
    return this.router.url.includes('admin');
  }

  isTeacher(): boolean {
    return this.router.url.includes('teacher');
  }
}
