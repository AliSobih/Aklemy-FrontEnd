import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import Swal from 'sweetalert2';
import { Coupon } from '@common/coupon';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponService } from '@services/coupon.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-coupon',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.scss',
})
export class CouponComponent implements OnInit, OnDestroy {
  couponEdit: Coupon[] = [];
  private couponsSubscription?: Subscription;
  courseId: number | undefined;

  couponsLoaded: boolean = false;
  couponsError: boolean = false;

  constructor(
    private couponService: CouponService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //  const id = this.activatedRoute.snapshot.paramMap.get('id');
    //      const decoded = jwt.verify(id!, 'secret_key'); // فك التشفير باستخدام نفس المفتاح
    //        this.courseId = +decoded;

    //  console.log('Course ID:', this.courseId);
    // this.courseId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadData();
    this.couponsSubscription = this.couponService
      .getCouponUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData() {
    this.couponsLoaded = false;
    this.couponsError = false;

    this.couponService.getallData(this.courseId!).subscribe({
      next: (data) => {
        this.couponsLoaded = true;
        this.couponEdit = data;
      },
      error: (error) => {
        this.couponsError = true;
        console.error('Error fetching data:', error);
      },
    });
  }

  onUpdate(couponEdit: Coupon) {
    const modalRef = this.modalService.open(AddCouponComponent);
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.couponEdit = couponEdit;
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
    this.couponService.deleteData(id).subscribe({
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

  openAddCouponModal() {
    const modalRef = this.modalService.open(AddCouponComponent);
    modalRef.componentInstance.courseId = this.courseId;
  }
  ngOnDestroy(): void {
    this.couponsSubscription?.unsubscribe();
  }
}
