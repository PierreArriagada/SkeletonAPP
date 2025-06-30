import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../models/user.model'; 
import { StateService } from '../../services/state.service';
import { DbtaskService } from '../../services/dbtask.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule, DecimalPipe
  ]
})
export class MisDatosComponent implements OnInit {

  userInfo: UserProfile | null = null;
  private userId = 1;

  nivelesEducacion = [
    { valor: 'basica', vistaValor: 'Básica' },
    { valor: 'media', vistaValor: 'Media' },
    { valor: 'superior', vistaValor: 'Superior (Técnica)' },
    { valor: 'universitaria', vistaValor: 'Universitaria (Profesional)' }
  ];

  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private dbTaskService: DbtaskService,
  ) { }

  async ngOnInit() {
    const username = await this.dbTaskService.getActiveUser();
    if(username === 'pierre') this.userId = 1; 
    
    // CORREGIDO: Verificar si profile no es null antes de usarlo
    this.apiService.getUserProfile(this.userId).subscribe((profile: UserProfile | null) => {
      if (profile) {
        // Solo proceder si profile no es null
        this.stateService.setCurrentUser(profile);
        this.dbTaskService.saveUserProfile(profile);
      } else {
        // Si no hay perfil, crear uno por defecto o manejar el caso
        console.log('No se encontró perfil para el usuario:', this.userId);
        this.createDefaultProfile();
      }
    });

    this.stateService.currentUser$.subscribe(user => {
      if (user && user.fechaNacimiento && typeof user.fechaNacimiento === 'string') {
        user.fechaNacimiento = new Date(user.fechaNacimiento);
      }
      this.userInfo = user;
    });
  }

  // NUEVO: Método para crear perfil por defecto
  private createDefaultProfile(): void {
    const defaultProfile: UserProfile = {
      id: this.userId,
      username: 'pierre', // o el username que corresponda
      nombre: '',
      apellido: '',
      educacion: '',
      fechaNacimiento: null,
      profileImageUrl: '',
      // Agregar lat y lng si están en tu modelo
      lat: null,
      lng: null
    };
    
    this.stateService.setCurrentUser(defaultProfile);
    this.dbTaskService.saveUserProfile(defaultProfile);
  }

  cambiarFoto() {
    this.apiService.takePicture().subscribe(newImageUri => {
      if (newImageUri && this.userInfo) {
        this.apiService.updateUserProfile(this.userId, { profileImageUrl: newImageUri })
          .subscribe(updatedProfile => {
            this.stateService.setCurrentUser(updatedProfile);
            alert('Foto de perfil actualizada.');
          });
      }
    });
  }
  
  obtenerUbicacionActual(): void {
    this.apiService.getCurrentLocation().subscribe({
      next: (coords) => {
        if(this.userInfo) {
          // Verificar si lat y lng existen en el modelo UserProfile
          if ('lat' in this.userInfo && 'lng' in this.userInfo) {
            (this.userInfo as any).lat = coords.lat;
            (this.userInfo as any).lng = coords.lng;
          }
          alert('Ubicación obtenida con éxito.');
        }
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  guardarInformacion(): void {
    if (this.userInfo) {
      this.apiService.updateUserProfile(this.userId, this.userInfo).subscribe({
        next: (updatedProfile) => {
          this.stateService.setCurrentUser(updatedProfile);
          alert('¡Datos guardados con éxito!');
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Error al guardar los datos. Inténtalo de nuevo.');
        }
      });
    }
  }

  limpiarFormulario(): void {
    if(this.userInfo) {
      this.userInfo = {
        id: this.userInfo.id,
        username: this.userInfo.username,
        nombre: '',
        apellido: '',
        educacion: '',
        fechaNacimiento: null,
        profileImageUrl: this.userInfo.profileImageUrl,
        // Agregar lat y lng si están en tu modelo
        ...(('lat' in this.userInfo) && { lat: null }),
        ...(('lng' in this.userInfo) && { lng: null })
      };
    }
  }
}