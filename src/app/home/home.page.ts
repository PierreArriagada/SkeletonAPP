import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Router no se usa aquí pero ActivatedRoute sí
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // FormsModule para [(ngModel)] o ReactiveFormsModule
import { IonicModule } from '@ionic/angular';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para MatDatepicker
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Opcional, para iconos en botones o datepicker

// Asegúrate de haber ejecutado `ng add @angular/material` y configurado BrowserAnimationsModule en app.module.ts o main.ts

interface UserInfo {
  nombre: string;
  apellido: string;
  educacion: string;
  fechaNacimiento: Date | null;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // O ReactiveFormsModule si prefieres formularios reactivos
    IonicModule,
    // Módulos de Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HomePage implements OnInit {
  userData: string | null = null; // Para el nombre de usuario "pierre"
  
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

  constructor(
    private route: ActivatedRoute,
    private router: Router // Inyectar Router para usar NavigationExtras
  ) {
    // Usar el estado de la navegación para obtener el usuario
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['user']) {
      this.userData = navigation.extras.state['user'];
    } else {
      // Fallback o manejo si no se encuentra el usuario (ej. si se accede a /home directamente)
      // Podrías redirigir al login o mostrar un nombre genérico
      // this.userData = "Invitado"; 
      // this.router.navigate(['/login']); // Ejemplo de redirección
    }
  }

  ngOnInit() {
    // Alternativa para recibir datos si el método del constructor no funciona en todos los casos
    // (aunque getCurrentNavigation es preferido para state).
    // this.route.queryParams.subscribe(params => {
    //   if (params['user']) {
    //     this.userData = params['user'];
    //   }
    // });
    if (this.userData) {
      console.log(`Bienvenido a Home, ${this.userData}`);
    }
  }

  limpiarFormulario(): void {
    this.userInfo = {
      nombre: '',
      apellido: '',
      educacion: '',
      fechaNacimiento: null
    };
    // Si usas ReactiveForms, sería this.profileForm.reset();
    console.log('Formulario limpiado');
  }

  mostrarInformacion(): void {
    console.log('Información del Formulario:', this.userInfo);
    // Aquí podrías hacer algo más con la información, como enviarla a un servicio.
    // Por ejemplo, mostrarla en una alerta:
    // alert(`Nombre: ${this.userInfo.nombre}\nApellido: ${this.userInfo.apellido}\nEducación: ${this.userInfo.educacion}\nFecha Nac: ${this.userInfo.fechaNacimiento}`);
  }
}