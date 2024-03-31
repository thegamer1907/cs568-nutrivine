import { CanActivateFn, Router } from '@angular/router';
import { PreferencesService } from '../services/preferences.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const userExistsGuard: CanActivateFn = async (route, state) => {
  const preferencesService = inject(PreferencesService);
  const router = inject(Router);
  const username = sessionStorage.getItem('username');

  // Check if username exists in the session storage before proceeding.
  if (!username) {
    // Optionally, redirect to a login or error page if the username is not found.
    router.navigate(['/login']);
    return false; // Prevent navigation.
  }

  const userPref = await firstValueFrom(preferencesService.getUserPreferences(username));

  if (userPref.length !== 0) {
    await router.navigate(['/chatlist']);
    return false; // Prevent the current navigation since we're redirecting.
  }
  return true;
};
