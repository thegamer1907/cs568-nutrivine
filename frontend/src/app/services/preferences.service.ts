import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants';
import { Preference } from '../models/preferences.model';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/preferences`);
  }

  getUserPreferences(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/user_preferences/`+username);
  }

  postUserPreferences(username: string, preferences: Preference[]): Observable<any> {
    // Define the HTTP headers if needed, for example to set 'Content-Type' to 'application/json'
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Construct the body of the request based on your backend requirements
    const body = {
      user: username,
      preferences: preferences
    };

    // Return the observable from the POST request
    // Adjust the URL as necessary to match your API endpoint
    return this.http.post<any>(`${API_URL}/user_preferences`, body, httpOptions);
  }
}
