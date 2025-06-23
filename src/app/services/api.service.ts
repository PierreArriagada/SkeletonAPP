import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiURL}/users/${userId}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  updateUserProfile(userId: number, data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiURL}/users/${userId}`, data).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentLocation(): Observable<{ lat: number; lng: number }> {
    return from(Geolocation.getCurrentPosition()).pipe(
      map(position => ({ lat: position.coords.latitude, lng: position.coords.longitude })),
      catchError(error => throwError(() => new Error('No se pudo obtener la ubicación.')))
    );
  }

  takePicture(): Observable<string> {
    return from(Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    })).pipe(
      map(photo => photo.webPath || ''),
      catchError(error => throwError(() => new Error('No se pudo usar la cámara.')))
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Algo salió mal con el servidor; por favor, inténtalo de nuevo.'));
  }
}