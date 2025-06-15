import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DbtaskService } from '../services/dbtask.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  userData: string | null = null;
  activeSegment = 'mis-datos'; // Segmento activo por defecto

  constructor(
    private router: Router,
    private dbtaskService: DbtaskService
  ) {}

  async ngOnInit() {
    // Obtiene el usuario activo desde el servicio, no de NavigationExtras
    this.userData = await this.dbtaskService.getActiveUser();
  }

  // Maneja el cambio de segmento para navegar 
  segmentChanged(event: any) {
    const segmentValue = event.detail.value;
    this.activeSegment = segmentValue;
    this.router.navigate(['home', segmentValue]);
  }

  // Cierra la sesión del usuario
  async logout() {
    await this.dbtaskService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}