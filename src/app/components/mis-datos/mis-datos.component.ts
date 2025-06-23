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
    
    this.apiService.getUserProfile(this.userId).subscribe(profile => {
      this.stateService.setCurrentUser(profile);
    });

    this.stateService.currentUser$.subscribe(user => {
      if (user && user.fechaNacimiento && typeof user.fechaNacimiento === 'string') {
        user.fechaNacimiento = new Date(user.fechaNacimiento);
      }
      this.userInfo = user;
    });
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
          this.userInfo.lat = coords.lat;
          this.userInfo.lng = coords.lng;
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
      this.apiService.updateUserProfile(this.userId, this.userInfo).subscribe(updatedProfile => {
        this.stateService.setCurrentUser(updatedProfile);
        alert('¡Datos guardados con éxito!');
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
        lat: null,
        lng: null,
        profileImageUrl: this.userInfo.profileImageUrl
      };
    }
  }
}