import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../common/category';
import Swal from 'sweetalert2';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [AddCategoryComponent, SkeletonModule, TableModule],
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
})
export class CategoryTableComponent implements OnInit, OnDestroy {
  Category?: Category[];
  private categoriesSubscription?: Subscription;
  loaddata: boolean = false;
  loadError: boolean = false;

  constructor(
    private categorieService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.categoriesSubscription = this.categorieService
      .getCategoriesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData() {
    this.loaddata = false;
    this.loadError = false;
    this.categorieService.getallData().subscribe({
      next: (data) => {
        this.loaddata = true;
        this.Category = data;
      },
      error: (error) => {
        this.loaddata = false;
        this.loadError = true;
      },
    });
  }

  onUpdate(category: Category) {
    const modalRef = this.modalService.open(AddCategoryComponent);
    modalRef.componentInstance.categoryToEdit = category;
  }

  confirmDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteData(id);
      }
    });
  }

  deleteData(id: any) {
    this.categorieService.deleteData(id).subscribe({
      next: (data) => {
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        this.loadData();
      },
      error: (error) => {
        Swal.fire('Error!', 'There was an error deleting the item.', 'error');
      },
    });
  }
  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }
}
