import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage {
  credentials = {
    username: '',
    password: ''
  };

  public loginApiError: string | null = null;

  @ViewChild('usernameInput', { read: ElementRef }) usernameInputElement!: ElementRef<HTMLIonInputElement>;
  @ViewChild('passwordInput', { read: ElementRef }) passwordInputElement!: ElementRef<HTMLIonInputElement>;

  constructor(
    private router: Router,
    private animationCtrl: AnimationController
  ) {}

  ionViewDidEnter() {
    this.animateInputElement(this.usernameInputElement);
    this.animateInputElement(this.passwordInputElement, 100);
  }

  async animateInputElement(elementRef: ElementRef<HTMLIonInputElement>, delay: number = 0) {
    // ... (código de animación sin cambios)
    if (elementRef && elementRef.nativeElement) {
      try {
        const inputToAnimate = await elementRef.nativeElement.getInputElement();
        if (inputToAnimate) {
          const inputAnimation = this.animationCtrl.create()
            .addElement(inputToAnimate)
            .duration(600)
            .delay(delay)
            .fromTo('opacity', '0.4', '1')
            .fromTo('transform', 'translateX(-20px)', 'translateX(0px)');
          inputAnimation.play();
        }
      } catch (error) {
        console.error("Error animando input:", error);
      }
    }
  }

  onLogin() {
    this.loginApiError = null; // Resetea el mensaje de error

    const username = this.credentials.username;
    const password = this.credentials.password;

    // --- INICIO DE DEPURACIÓN ---
    console.log('--- Intento de Login ---');
    console.log('Usuario ingresado:', username, '(Tipo:', typeof username, ')');
    console.log('Contraseña ingresada:', password, '(Tipo:', typeof password, ')');
    // --- FIN DE DEPURACIÓN ---

    // 1. Validaciones de formato (PGY4221)
    const isUsernameFormatValid = username.length >= 3 && username.length <= 8 && /^[a-zA-Z0-9]*$/.test(username);
    console.log('¿Formato de usuario válido?:', isUsernameFormatValid);

    if (!isUsernameFormatValid) {
      this.loginApiError = "Formato de nombre de usuario incorrecto. Debe ser alfanumérico, entre 3 y 8 caracteres.";
      console.error('Error de formato:', this.loginApiError);
      return; // Detiene la ejecución si el formato del usuario es incorrecto
    }

    const isPasswordFormatValid = /^[0-9]{4}$/.test(password);
    console.log('¿Formato de contraseña válido?:', isPasswordFormatValid);

    if (!isPasswordFormatValid) {
      this.loginApiError = "Formato de contraseña incorrecto. Debe ser numérica de 4 dígitos.";
      console.error('Error de formato:', this.loginApiError);
      return; // Detiene la ejecución si el formato de la contraseña es incorrecto
    }

    // 2. Validación de credenciales específicas
    const targetUsername = "pierre";
    const targetPassword = "1234";

    console.log(`Comparando: ('${username.toLowerCase()}' === '${targetUsername}') Y ('${password}' === '${targetPassword}')`);

    if (username.toLowerCase() === targetUsername && password === targetPassword) {
      console.log('¡Credenciales correctas! Navegando a /home...');

      let navigationExtras: NavigationExtras = {
        state: {
          user: username
        }
      };
      this.router.navigate(['/home'], navigationExtras).catch(navError => {
        console.error('Error al navegar a /home:', navError);
        this.loginApiError = 'Error al intentar navegar a la página principal.';
      });

    } else {
      console.warn('Credenciales incorrectas.');
      this.loginApiError = 'Nombre de usuario o contraseña incorrectos.';
    }
  }

  onForgotPassword() {
    console.log('Clic en "Olvidé mi contraseña"');
  }
}