import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Method to check if user is logged in
  isLoggedIn(): boolean {
    console.log("User = ",sessionStorage.getItem('username'));
    return sessionStorage.getItem('username') !== null;
  }

  // Method to redirect to login page
  redirectToLogin() {
    // Assuming you have a route named 'login' for your login page
    this.router.navigate(['/']);
  }
}
