import { Component } from '@angular/core';
import { CategoryTableComponent } from './category-table/category-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoryComponent } from './add-category/add-category.component';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CategoryTableComponent,
    SidebarComponent,
    CommonModule,
    SkeletonModule,
    TableModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  constructor(private activpop: NgbModal, private router: Router) {}
  isSidebarHovered: boolean = false;

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }
  openAddCourseModal() {
    this.activpop.open(AddCategoryComponent);
  }
}
