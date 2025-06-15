import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DbtaskService } from '../services/dbtask.service'; // Importa el servicio de la base de datos

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  public loginApiError: string | null = null;

  @ViewChild('usernameInput', { read: ElementRef }) usernameInputElement!: ElementRef<HTMLIonInputElement>;
  @ViewChild('passwordInput', { read: ElementRef }) passwordInputElement!: ElementRef<HTMLIonInputElement>;

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private dbtaskService: DbtaskService // Inyecta el servicio para poder usarlo
  ) {}

  ngOnInit() {
    // Se asegura que la BD esté lista y registra un usuario de prueba.
    this.dbtaskService.getDbReady().subscribe((isReady: boolean) => {
      if (isReady) {
        this.dbtaskService.registrarUsuario('pierre', '1234');
      }
    });
  }

  ionViewDidEnter() {
    this.animateInputElement(this.usernameInputElement);
    this.animateInputElement(this.passwordInputElement, 100);
  }

  async animateInputElement(elementRef: ElementRef<HTMLIonInputElement>, delay: number = 0) {
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

  async onLogin() {
    this.loginApiError = null;
    const { username, password } = this.credentials;

    // 1. Validaciones de formato
    const isUsernameFormatValid = username.length >= 3 && username.length <= 8 && /^[a-zA-Z0-9]*$/.test(username);
    if (!isUsernameFormatValid) {
      this.loginApiError = "Formato de usuario incorrecto (3-8 caracteres, alfanumérico).";
      return;
    }
    const isPasswordFormatValid = /^[0-9]{4}$/.test(password);
    if (!isPasswordFormatValid) {
      this.loginApiError = "Formato de contraseña incorrecto (4 dígitos numéricos).";
      return;
    }

    // 2. Conexión con la base de datos para validar credenciales.
    const isValid = await this.dbtaskService.validarUsuario(username, password);

    if (isValid) {
      // 3. Si las credenciales son válidas, se activa la sesión en la BD y se navega.
      await this.dbtaskService.activarSesion(username);
      this.router.navigate(['/home']);
    } else {
      this.loginApiError = 'Nombre de usuario o contraseña incorrectos.';
    }
  }

  onForgotPassword() {
    console.log('Clic en "Olvidé mi contraseña"');
  }
}