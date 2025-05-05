import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AddNationalityComponent } from './add-nationality/add-nationality.component';
import { ActivatedRoute } from '@angular/router';
import { Nationality } from '@common/nationality';
import { NationalityService } from '@services/nationality.service';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-nationality-course',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './nationality-course.component.html',
  styleUrl: './nationality-course.component.scss',
})
export class NationalityCourseComponent implements OnInit, OnDestroy {
  nationalityEdit: Nationality[] = [];
  private nationalitysSubscription?: Subscription;
  courseId: number | undefined;
  price?: number;
  totalprice: number | undefined;

  nationalityLoaded: boolean = false;
  nationalityError: boolean = false;

  constructor(
    private nationalityService: NationalityService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.price = +this.activatedRoute.snapshot.paramMap.get('price')!;

    this.loadData();
    this.nationalitysSubscription = this.nationalityService
      .getNationalityUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData() {
    this.nationalityLoaded = false;
    this.nationalityError = false;
    this.nationalityService.getallData(this.courseId!).subscribe({
      next: (data) => {
        this.nationalityLoaded = true;
        this.nationalityEdit = data;
      },
      error: (error) => {
        this.nationalityError = true;
        console.error('Error fetching data:', error);
      },
    });
  }

  onUpdate(nationalityEdit: Nationality) {
    const modalRef = this.modalService.open(AddNationalityComponent);
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.nationalityToEdit = nationalityEdit;
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
    this.nationalityService.deleteData(id).subscribe({
      next: (data) => {
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting data:', error);
        Swal.fire('Error!', 'There was an error deleting the item.', 'error');
      },
    });
  }

  openAddNationalityModal() {
    const modalRef = this.modalService.open(AddNationalityComponent);
    modalRef.componentInstance.courseId = this.courseId;
  }

  roundToNearestInteger(value: number): number {
    return Math.round(value);
  }

  ngOnDestroy(): void {
    this.nationalitysSubscription?.unsubscribe();
  }
}
