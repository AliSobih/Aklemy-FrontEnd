import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDescriptionMasterComponent } from './add-description-master/add-description-master.component';
import { Subscription } from 'rxjs';
import { DescriptionMaster } from '@common/description-master';
import { SidebarComponent } from '@core//sidebar/sidebar.component';
import { DescriptionMasterService } from '@services/description-master.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-description-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SidebarComponent,
    SkeletonModule,
  ],
  templateUrl: './description-master.component.html',
  styleUrls: ['./description-master.component.scss'],
})
export class DescriptionMasterComponent implements OnInit, OnDestroy {
  isEditMode = false;
  hasUnsavedChanges = false;
  descriptionMaster: DescriptionMaster[] = [];
  courseId?: number;
  private descriptionMasterSupscription?: Subscription;

  descriptionLoaded: boolean = false;
  descriptionError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private descriptionMasterService: DescriptionMasterService,
    private activpop: NgbModal
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params['id'];
    });
    this.loadData();
    this.descriptionMasterSupscription = this.descriptionMasterService
      .getdescriptionMastersUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  openAddDescriptionMasterModal() {
    const modalRef = this.activpop.open(AddDescriptionMasterComponent);
    modalRef.componentInstance.courseId = this.courseId;
  }

  openEditDescriptionMasterModal(item: DescriptionMaster | any) {
    const modalRef = this.activpop.open(AddDescriptionMasterComponent);
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.descriptionMasterItem = item;
    modalRef.componentInstance.isEditMode = true;
  }

  deleteDescriptionMaster(id: any) {
    this.descriptionMasterService.deleteData(id).subscribe({
      next: () => {
        Swal.fire(
          'Deleted!',
          'The description master has been deleted.',
          'success'
        );
        this.loadData();
      },
      error: () => {
        Swal.fire(
          'Error!',
          'There was an error deleting the description master.',
          'error'
        );
      },
    });
  }

  loadData(): void {
    this.descriptionLoaded = false;
    this.descriptionError = false;
    this.descriptionMasterService
      .getDescriptionMasterByCourseId(this.courseId!)
      .subscribe(
        (data) => {
          this.descriptionLoaded = true;
          this.descriptionMaster = data;
        },
        (error) => {
          this.descriptionError = true;
        }
      );
  }
  deleteDetails(id: any) {
    this.descriptionMasterService.deletedetals(id).subscribe({
      next: () => {
        Swal.fire(
          'Deleted!',
          'The description master has been deleted.',
          'success'
        );
        this.loadData();
      },
      error: () => {
        Swal.fire(
          'Error!',
          'There was an error deleting the description master.',
          'error'
        );
      },
    });
  }
  ngOnDestroy(): void {
    this.descriptionMasterSupscription?.unsubscribe();
  }
}
