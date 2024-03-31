import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  if(!isLoggedIn) {
    inject(AuthService).redirectToLogin();
  }
  return isLoggedIn;
};
