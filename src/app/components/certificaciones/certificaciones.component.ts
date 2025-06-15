import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

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

  constructor() { }

  ngOnInit() {}

  onToggleVencimiento() {
    if (!this.certificacionData.tieneVencimiento) {
      this.certificacionData.fechaVencimiento = '';
    }
  }

  guardarCertificacion() {
    console.log('Datos de Certificación:', this.certificacionData);
    alert('Certificación guardada. Revisa la consola para ver los datos.');
  }

}