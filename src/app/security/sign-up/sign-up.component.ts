import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterAccount } from '@common/security/register-account';
import { SecurityService } from '@services/security.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  saved: boolean = false;
  loding: boolean = false;
  emailExists: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private router: Router
  ) {
    this.signUpForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const register: RegisterAccount = {
        email: this.signUpForm.value.email,
        name: this.signUpForm.value.userName,
        nameAr: '',
        password: this.signUpForm.value.password,
      };
      this.loding = true;
      this.securityService.signUp(register).subscribe({
        next: (data) => {
          this.loding = false;
          this.saved = true;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        },
        error: (err) => {
          this.loding = false;
          if (err.status === 409) {
            // Assuming 409 is returned for duplicate emails
            this.emailExists = true;
          }
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  get emailControl() {
    return this.signUpForm.get('email');
  }
}
