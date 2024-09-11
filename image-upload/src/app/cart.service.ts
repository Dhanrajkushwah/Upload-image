import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private isAuthenticated = false;
  constructor(private http: HttpClient) {
    this.isAuthenticated = !!localStorage.getItem('userToken');
  }

  // Register User
  signup(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/signup`, obj);
  }

  // Log in user
  login(obj: any): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/login`, obj).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('userToken', response.token); // Save token to localStorage
          this.isAuthenticated = true; // Update authentication status
        }
      })
    );
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Log out user
  logout(): void {
    localStorage.removeItem('userToken'); // Remove token from localStorage
    this.isAuthenticated = false;
  }

  // Get user token (if needed)
  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  craetecart(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment._api}/api/user/upload`, formData);
  }


  getupload(): Observable<any[]> {
    return this.http.get<any[]>(`${environment._api}/api/user/listcart`);
  }

updateCartItem(item: any): Observable<any> {
  return this.http.put<any>(`${environment._api}/update`, item); // Adjust the URL and method as needed
}
}
