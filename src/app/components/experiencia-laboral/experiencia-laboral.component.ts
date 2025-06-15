import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Modelo para los datos de experiencia
interface Experiencia {
  empresa: string;
  anoInicio: number | null;
  trabajaActualmente: boolean;
  anoTermino: number | null;
  cargo: string;
}

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ExperienciaLaboralComponent implements OnInit {

  experienciaData: Experiencia = {
    empresa: '',
    anoInicio: null,
    trabajaActualmente: false,
    anoTermino: null,
    cargo: ''
  };

  constructor() { }

  ngOnInit() {}

  // Limpia el año de término si el usuario marca que trabaja actualmente ahí
  onToggleTrabajo() {
    if (this.experienciaData.trabajaActualmente) {
      this.experienciaData.anoTermino = null;
    }
  }

  guardarExperiencia() {
    // Aquí iría la lógica para guardar los datos, por ahora solo los mostramos
    console.log('Datos de Experiencia Laboral:', this.experienciaData);
    alert('Experiencia guardada. Revisa la consola para ver los datos.');
  }
}