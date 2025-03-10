import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { AccountModel } from '../models/AccountModel';
import { UserMessageModel } from '../models/UserMessageModel';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/account`;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public userLoggedOut = new Subject<void>();

  saveConfig(config: string): Observable<any> {
    return this.http.post(this.apiUrl + '/save-config', {value: config});
  }

  register(account: AccountModel): Observable<any> {
    return this.http.post(this.apiUrl + '/register', account);
  }

  update(account: AccountModel): Observable<any> {
    return this.http.put(this.apiUrl + '/update', account);
  }

  delete(): Observable<any> {
    return this.http.delete(this.apiUrl + '/delete');
  }

  changePassword(passwords: any): Observable<any> {
    return this.http.put(this.apiUrl + '/change-password', passwords);
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/reset-password', {
      token: token,
      newPassword: password
    });
  }

  sendUserMessage(message: UserMessageModel): Observable<any> {
    return this.http.post(this.apiUrl + '/add-user-message', message);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.apiUrl + '/forgot-password', 
      {userEmail: email, userPassword: '?'});
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/login', 
      { userEmail: email, userPassword: password })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userLoggedOut.next();
  }

  get isAuthenticated(): boolean {
    const token = this.token;
    return !this.jwtHelper.isTokenExpired(token);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get accountClaims(): any {
    if (!this.isAuthenticated) {
      return null;
    }
    const claims = this.jwtHelper.decodeToken(this.token || '');
    return claims;
  }

  get userName(): string {
    if (!this.isAuthenticated) {
      return '';
    }
    return this.accountClaims.userName;
  }

  get accountId(): string {
    if (!this.isAuthenticated) {
      return '';
    }
    return this.accountClaims.id;
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    //    if (password && confirmPassword && password !== confirmPassword) {
    if (password !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
    } else {
      g.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }


}