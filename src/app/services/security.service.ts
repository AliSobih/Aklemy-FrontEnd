import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { ChangePassword } from '@common/security/change-password';
import { JwtToken } from '@common/security/jwt-token';
import { Login } from '@common/security/login';
import { RegisterAccount } from '@common/security/register-account';
import { ResetPassword } from '@common/security/reset-password';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private httpClient: HttpClient) {}

  signUp(register: RegisterAccount): Observable<boolean> {
    return this.httpClient.post<boolean>(
      Constants.SECURITY_REGISTRATION_SIGNUP_API,
      register,
      {
        headers: new HttpHeaders({ skip: 'true' }),
      }
    );
  }

  logIn(login: Login): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(
      Constants.SECURITY_LOGIN_SIGNIN_API,
      login,
      {
        headers: new HttpHeaders({ skip: 'true' }),
      }
    );
  }

  confirmEmail(token: String): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${Constants.SECURITY_REGISTRATION_CONFIRM_API}?token=${token}`
    );
  }

  createPasswordResetToken(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${Constants.SECURITY_CREATE_RESET_PASSWORD_TOKEN_API}/${email}`
    );
  }

  conformResetPassword(token: string): Observable<boolean> {
    return this.httpClient.get<boolean>(
      `${Constants.SECURITY_CONFORM_RESET_PASSWORD_TOKEN}?token=${token}`
    );
  }

  resetPassword(resetPassword: ResetPassword): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${Constants.SECURITY_RESET_PASSWORD_TOKEN}`,
      resetPassword
    );
  }

  changePassword(
    userId: number,
    changePassword: ChangePassword
  ): Observable<boolean> {
    return this.httpClient.put<boolean>(
      Constants.SECURITY_CHANGE_PASSWORD + userId,
      changePassword
    );
  }

  // persistLogIn() {
  //   const encToken = JSON.stringify(this.token);
  //   let enc = CryptoJS.AES.encrypt(encToken, '').toString();
  //   localStorage.setItem('token', enc);
  //   this.logInEvent.next(this.token);
  // }
  // saveCustomer(customer: CustomerModel) {
  //   this.token.customerDTO = customer;
  //   localStorage.setItem(
  //     'token',
  //     CryptoJS.AES.encrypt(JSON.stringify(this.token), '').toString()
  //   );

  //   this.logInEvent.next(this.token);
  // }

  // getToken(): Jwt_tokenModel {
  //   const encToken = localStorage.getItem('token');
  //   if (encToken == null) {
  //     return null;
  //   }
  //   let dec: string = '';
  //   try {
  //     dec = CryptoJS.AES.decrypt(encToken, '').toString(CryptoJS.enc.Utf8);
  //   } catch (e) {
  //     this.token = null;
  //     localStorage.removeItem('token');
  //     window.location.reload();
  //   }
  //   return JSON.parse(dec);
  // }

  // removeLogIn() {
  //   this.token = null;
  //   localStorage.removeItem('token');
  //   SecurityService.customerRole = undefined;
  //   this.logInEvent.next(null);
  // }
}
