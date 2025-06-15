import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

interface UserInfo {
  nombre: string;
  apellido: string;
  educacion: string;
  fechaNacimiento: Date | null;
}

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonicModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule
  ]
})
export class MisDatosComponent implements OnInit {
  userInfo: UserInfo = {
    nombre: '',
    apellido: '',
    educacion: '',
    fechaNacimiento: null
  };

  nivelesEducacion = [
    { valor: 'basica', vistaValor: 'Básica' },
    { valor: 'media', vistaValor: 'Media' },
    { valor: 'superior', vistaValor: 'Superior (Técnica)' },
    { valor: 'universitaria', vistaValor: 'Universitaria (Profesional)' }
  ];

  constructor() { }

  ngOnInit() {}

  limpiarFormulario(): void {
    this.userInfo = { nombre: '', apellido: '', educacion: '', fechaNacimiento: null };
  }

  mostrarInformacion(): void {
    console.log('Información del Formulario:', this.userInfo);
  }
}