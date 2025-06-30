import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../../services/api.service'; 

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {}

  // Limpia el año de término si el usuario marca que trabaja actualmente ahí
  onToggleTrabajo() {
    if (this.experienciaData.trabajaActualmente) {
      this.experienciaData.anoTermino = null;
    }
  }

  guardarExperiencia() {
    this.apiService.guardarExperiencia(this.experienciaData).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
        alert('Experiencia guardada con éxito (simulado).');
      },
      error: (err) => {
        alert('Hubo un error al guardar la experiencia.');
      }
    });
  }
}