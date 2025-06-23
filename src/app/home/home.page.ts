import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DbtaskService } from '../services/dbtask.service';
import { StateService } from '../services/state.service';
import { UserProfile } from '../models/user.model';


import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit, OnDestroy {
  
  userProfile: UserProfile | null = null;
  activeSegment = 'mis-datos';
  private userSubscription!: Subscription;

  constructor(
    private router: Router,
    private dbtaskService: DbtaskService,
    private stateService: StateService
  ) {
    addIcons({ logOutOutline });
   
  }

  ngOnInit() {
    this.userSubscription = this.stateService.currentUser$.subscribe(user => {
      this.userProfile = user;
    });
  }

  ionViewWillEnter() {
    if(this.router.url === '/home' || this.router.url === '/home/') {
      this.router.navigate(['home/mis-datos'], { replaceUrl: true });
    }
  }

  segmentChanged(event: any) {
    const segmentValue = event.detail.value;
    this.activeSegment = segmentValue;
    this.router.navigate(['home', segmentValue]);
  }

  async logout() {
    await this.dbtaskService.cerrarSesion();
    this.stateService.setCurrentUser(null);
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}