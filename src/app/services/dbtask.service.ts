import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DbtaskService {
  public database!: SQLiteObject;
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
      try {
        const db = await this.sqlite.create({ name: 'sesion.db', location: 'default' });
        this.database = db;
        await this.crearTablas();
      } catch (e) { 
        console.error('Error al inicializar SQLite:', e); 
        this.dbReady.next(true);
      }
    } else {
      console.warn('SQLite no está disponible en el navegador.');
      this.dbReady.next(true);
    }
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady.next(true);
  }

  private async _waitForStorage() {
    return firstValueFrom(this.storageReady.asObservable().pipe(filter((isReady: boolean) => isReady)));
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
      
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY,
          username TEXT,
          nombre TEXT,
          apellido TEXT,
          educacion TEXT,
          fechaNacimiento TEXT,
          profileImageUrl TEXT
        );`, []
      );
      this.dbReady.next(true);
    } catch (e) { 
      console.error('Error al crear las tablas', e); 
      this.dbReady.next(true); 
    }
  }

  async saveUserProfile(profile: UserProfile) {
    await firstValueFrom(this.dbReady.asObservable().pipe(filter((isReady: boolean) => isReady)));
    if (!this.database) return;
    const sql = `INSERT OR REPLACE INTO user_profile (id, username, nombre, apellido, educacion, fechaNacimiento, profileImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const fecha = profile.fechaNacimiento ? profile.fechaNacimiento.toString() : null;
    return this.database.executeSql(sql, [profile.id, profile.username, profile.nombre, profile.apellido, profile.educacion, fecha, profile.profileImageUrl]);
  }

 
  async getStoredUserProfile(userId: number): Promise<UserProfile | null> {
    await firstValueFrom(this.dbReady.asObservable().pipe(filter((isReady: boolean) => isReady)));
    
    if (!this.database) {
      return null; 
    }
    
    try {
      const sql = `SELECT * FROM user_profile WHERE id = ?`;
      const data = await this.database.executeSql(sql, [userId]);
      
      if (data.rows.length > 0) {
        return data.rows.item(0) as UserProfile;
      }
      
      return null; 
    } catch (error) {
      console.error('Error getting stored user profile:', error);
      return null;
    }
  }

  getDbReady() {
    return this.dbReady.asObservable();
  }

  async registrarUsuario(user: string, pass: string) {
    await firstValueFrom(this.dbReady.asObservable().pipe(filter((isReady: boolean) => isReady)));
    if (!this.database) return;
    const sql = 'INSERT OR IGNORE INTO sesion_data (user_name, password, active) VALUES (?, ?, ?)';
    return this.database.executeSql(sql, [user.toLowerCase(), pass, 0]);
  }

  async validarUsuario(user: string, pass: string): Promise<boolean> {
    if (!this.platform.is('capacitor')) {
      return user.toLowerCase() === 'pierre' && pass === '1234';
    }
    
    await firstValueFrom(this.dbReady.asObservable().pipe(filter((isReady: boolean) => isReady)));
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

