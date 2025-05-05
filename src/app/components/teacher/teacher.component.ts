import { Component } from '@angular/core';

import { FooterComponent } from '../core/footer/footer.component';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../core/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../core/sidebar/sidebar.component";
import { DragComponent } from './drag/drag.component';

@Component({
  selector: 'app-teacher',
  standalone: true,
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss',
  imports: [
    RouterOutlet,
    FooterComponent,
    MatPaginatorModule,
    CommonModule,
    HttpClientModule,
    HeaderComponent,
    SidebarComponent,
    DragComponent,
  ],
})
export class TeacherComponent {
  isSidebarHovered: boolean = false;

  constructor(private router: Router) {}

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }
}
