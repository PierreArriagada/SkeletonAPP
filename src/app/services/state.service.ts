import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private currentUserSource = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor() { }

  setCurrentUser(user: UserProfile | null): void {
    this.currentUserSource.next(user);
  }
}