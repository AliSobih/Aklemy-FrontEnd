import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  NavigationEnd,
  NavigationStart,
} from '@angular/router';
import { TeacherRequestService } from '@services/teacher-request.service';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-add-teacher-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatInputModule,
    DropdownModule,
  ],
  templateUrl: './add-teacher-request.component.html',
  styleUrls: ['./add-teacher-request.component.scss'],
})
export class AddTeacherRequestComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  teacherForm: FormGroup;
  countries: any[] = [];
  filteredCountries: any[] = [];
  selectedCity: City | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private teacherRequestService: TeacherRequestService,
    private activatedRoute: ActivatedRoute
  ) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      city: [this.selectedCity?.name, Validators.required],
      coursesName: ['', Validators.required],
      trainerNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      notes: [''],
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadCountries();
  }

  ngAfterViewInit(): void {
    // if (this.scrollTarget) {
    //   this.scrollTarget.nativeElement.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'start',
    //   });
    // }
  }

  loadCountries() {
    this.http.get<any[]>('../../../../assets/countries.json').subscribe({
      next: (data) => {
        this.countries = data;
      },
      error: (err) => {},
    });
  }

  filterCountries(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredCountries = this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      let data = this.teacherForm.value;
      let req = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city.name,
        coursesName: data.coursesName,
        trainerNumber: data.trainerNumber,
        notes: data.notes,
      };

      this.teacherRequestService.postData(req).subscribe({
        next: (data) => {
          Swal.fire('Saved!', 'The joen us has been saved.', 'success');
          this.teacherForm.reset();
          this.router.navigate(['home']);
        },
        error: (err) => {},
      });
    }
  }
}
