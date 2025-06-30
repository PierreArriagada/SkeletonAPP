import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

interface Certificacion {
  nombre: string;
  fechaObtencion: string;
  tieneVencimiento: boolean;
  fechaVencimiento: string;
}

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['./certificaciones.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CertificacionesComponent implements OnInit {

  certificacionData: Certificacion = {
    nombre: '',
    fechaObtencion: '',
    tieneVencimiento: false,
    fechaVencimiento: ''
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {}

  onToggleVencimiento() {
    if (!this.certificacionData.tieneVencimiento) {
      this.certificacionData.fechaVencimiento = '';
    }
  }

  guardarCertificacion() {
    this.apiService.guardarCertificacion(this.certificacionData).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        alert('Certificación guardada con éxito (simulado).');
      },
      error: (err) => {
        alert('Hubo un error al guardar la certificación.');
      }
    });
  }
}