import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '@services/security.service';

@Component({
  selector: 'app-create-reset-password-token',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-reset-password-token.component.html',
  styleUrl: './create-reset-password-token.component.scss',
})
export class CreateResetPasswordTokenComponent {
  form: FormGroup;
  loadding: boolean = false;
  emailExist: boolean | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loadding = true;
      this.emailExist = null;
      const email: string = this.form.value.email;
      this.securityService
        .createPasswordResetToken(email.trim())
        .subscribe((data) => {
          this.loadding = false;
          this.emailExist = data;
        });
    }
  }

  login() {
    this.router.navigate(['login']);
  }
}
