import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../../services/preferences.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Questions, Preference } from '../../models/preferences.model';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dietary-form',
  templateUrl: './dietary-form.component.html',
  styleUrls: ['./dietary-form.component.css']
})
export class DietaryFormComponent implements OnInit {
  questions: Questions[] = [];
  username: string = '';

  form: FormGroup = new FormGroup({
  })

  constructor(
    private router: Router,
    private preferencesService: PreferencesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.username = sessionStorage.getItem('username') == null?'':sessionStorage.getItem('username')!;
    await this.loadQuestions();
    for(var question of this.questions) {
        const formControl = new FormControl('', Validators.required);
        const formControlCustom = new FormControl('');
        this.form.addControl(question.text, formControl);
        this.form.addControl(question.text+"Custom",formControlCustom);
    }
  }

  async loadQuestions(): Promise<void> {
    this.questions = await firstValueFrom(this.preferencesService.getQuestions());
    console.log("Questions",this.questions);
  }

  async submitForm(): Promise<void> {
    let userPreferences: Preference[] = [];
    for( let question of this.questions){
      var answer = this.form.controls[question.text].value;
      if(answer.includes('Other')){
        answer = this.form.controls[question.text+'Custom'].value;
      }
      const preference = {
        question: question.text,
        answer: answer
      }
      userPreferences.push(preference);
    }
    await firstValueFrom(this.preferencesService.postUserPreferences(this.username,userPreferences));
    this.router.navigate(['/chatlist']);
  }
}
