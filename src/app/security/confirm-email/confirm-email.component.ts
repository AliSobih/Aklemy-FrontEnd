import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '@services/security.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent {
  token: string | null = null;
  isLoading: boolean = false;
  conformedToken: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      this.isLoading = true;
      this.securityService
        .confirmEmail(this.token)
        .subscribe((data: boolean) => {
          this.conformedToken = data;
          this.isLoading = false;
          if (data) {
            // this.router.navigate(['store/reset-password/set-password'], {
            //   queryParams: { token: this.token },
            // });
          }
        });
    }
  }
  gologin(){
    this.router.navigate(['login']);
  }
}
