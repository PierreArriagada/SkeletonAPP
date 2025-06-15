import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DbtaskService {
  public database!: SQLiteObject;

  // Señales para saber cuándo la BD y el Storage están listos
  private dbReady = new BehaviorSubject<boolean>(false);
  private storageReady = new BehaviorSubject<boolean>(false);

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.initStorage();
    await this.platform.ready();

    if (this.platform.is('capacitor')) {
      // Si estamos en un dispositivo móvil, inicializa SQLite
      try {
        const db = await this.sqlite.create({
          name: 'sesion.db',
          location: 'default'
        });
        this.database = db;
        await this.crearTablas();
      } catch (e) {
        console.error('Error al inicializar SQLite:', e);
      }
    } else {
      // Si estamos en un navegador, no inicializamos SQLite
      console.warn('SQLite no está disponible en el navegador.');
      this.dbReady.next(true); // Marcamos como listo para que la app no se bloquee
    }
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady.next(true); // Avisa que el Storage está listo
  }

  private async _waitForStorage() {
    return firstValueFrom(this.storageReady.asObservable().pipe(filter(isReady => isReady)));
  }

  async crearTablas() {
    try {
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS sesion_data (
          user_name TEXT PRIMARY KEY NOT NULL,
          password TEXT NOT NULL,
          active INTEGER NOT NULL
        );`, []
      );
      this.dbReady.next(true);
    } catch (e) {
      console.error('Error al crear la tabla', e);
    }
  }

  getDbReady() {
    return this.dbReady.asObservable();
  }

  async registrarUsuario(user: string, pass: string) {
    await firstValueFrom(this.dbReady.asObservable().pipe(filter(isReady => isReady)));
    if (!this.database) return; // No hace nada si no hay BD (estamos en navegador)
    const sql = 'INSERT OR IGNORE INTO sesion_data (user_name, password, active) VALUES (?, ?, ?)';
    return this.database.executeSql(sql, [user.toLowerCase(), pass, 0]);
  }

  async validarUsuario(user: string, pass: string): Promise<boolean> {
    if (!this.platform.is('capacitor')) {
      // Simula un login exitoso en el navegador para pruebas
      return user.toLowerCase() === 'pierre' && pass === '1234';
    }
    // En un dispositivo, valida contra la BD real
    await firstValueFrom(this.dbReady.asObservable().pipe(filter(isReady => isReady)));
    const sql = 'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?';
    const data = await this.database.executeSql(sql, [user.toLowerCase(), pass]);
    return data.rows.length > 0;
  }

  async activarSesion(user: string) {
    await this._waitForStorage();
    await this.storage.set('sesion_activa', user.toLowerCase());
    if (this.database) {
      const sql = 'UPDATE sesion_data SET active = 1 WHERE user_name = ?';
      await this.database.executeSql(sql, [user.toLowerCase()]);
    }
  }

  async cerrarSesion() {
    await this._waitForStorage();
    const user = await this.storage.get('sesion_activa');
    await this.storage.remove('sesion_activa');
    if (this.database && user) {
      const sql = 'UPDATE sesion_data SET active = 0 WHERE user_name = ?';
      await this.database.executeSql(sql, [user]);
    }
  }

  async verificarSesionActiva(): Promise<boolean> {
    await this._waitForStorage();
    const user = await this.storage.get('sesion_activa');
    return user !== null;
  }

  async getActiveUser(): Promise<string | null> {
    await this._waitForStorage();
    return this.storage.get('sesion_activa');
  }
}