import { Component } from '@angular/core';
import { CourseTableComponent } from './course-table/course-table.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CourseTableComponent, RouterModule, CommonModule, SidebarComponent],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  isSidebarHovered: boolean = false;

  constructor(private router: Router) {}

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }
}
