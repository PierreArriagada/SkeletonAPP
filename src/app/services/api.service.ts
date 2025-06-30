import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserProfile } from '../models/user.model';
import { DbtaskService } from './dbtask.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private dbtaskService: DbtaskService
  ) { }


  getUserProfile(userId: number): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${this.apiURL}/users/${userId}`).pipe(
      retry(2), 
      catchError((error: HttpErrorResponse) => {
        console.warn('API falló. Intentando cargar desde la base de datos local.');
        
        return from(this.dbtaskService.getStoredUserProfile(userId)).pipe(
          switchMap((storedProfile: UserProfile | null) => {
            if (storedProfile) {
              
              return of(storedProfile);
            } else {
              
              console.error('Sin conexión y sin datos locales para el perfil.');
              return of(null);
            }
          })
        );
      })
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

  guardarExperiencia(experienciaData: any): Observable<any> {
    return this.http.post('https://jsonplaceholder.typicode.com/posts', experienciaData).pipe(
      catchError(this.handleError)
    );
  }
  
  guardarCertificacion(certificacionData: any): Observable<any> {
    return this.http.post('https://jsonplaceholder.typicode.com/posts', certificacionData).pipe(
      catchError(this.handleError)
    );
  }
}