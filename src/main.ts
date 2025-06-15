import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// --- Importaciones NECESARIAS para la Base de Datos y Angular Material ---
import { IonicStorageModule } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Proveedores existentes
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // --- PROVEEDORES AÑADIDOS Y CORREGIDOS ---

    // 1. Proveedor para el plugin de SQLite
    SQLite,

    // 2. Usamos importProvidersFrom para módulos que no son standalone
    importProvidersFrom(
      // Módulo para que funcione Ionic Storage (clave/valor)
      IonicStorageModule.forRoot(),

      // Módulo necesario para que funcionen las animaciones de Angular Material
      BrowserAnimationsModule
    ),
  ],
});