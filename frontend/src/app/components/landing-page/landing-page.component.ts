import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreferencesService } from '../../services/preferences.service';
import { firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
  })

  get username(): string {
    return this.form.get('username')?.value;
  }

  constructor(
    private router: Router,
    private preferencesService: PreferencesService
  ) { }

  ngOnInit(): void {
  }

  async continue() {
    // Assuming you have a service to check if the user is new
    sessionStorage.setItem('username', this.username);
    await this.checkIfNewUser().then(isNewUser => {
      if (isNewUser) {
        this.router.navigate(['/dietary-form']);
      } else {
        // Redirect to another page for existing users
        this.router.navigate(['/chatlist']);
      }
    });
    
  }

  async checkIfNewUser(): Promise<boolean> {
    // Add logic to check if the user is new
    // You can use localStorage, cookies, or a backend API for this
    try {
      const data = await firstValueFrom(this.preferencesService.getUserPreferences(this.username));
      return data.length == 0;
    } catch (error) {
      console.error("Error checking if user is new:", error);
      return false;
    }
  }
}
