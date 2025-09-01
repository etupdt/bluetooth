import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { BleService } from '../services/ble-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(
    private bleService: BleService
  ) {}

  scanBle() {
    // alert('Scan button clicked');

    this.bleService.scan().then(() => {
      alert('Scan completed');
    }).catch(error => {
      alert('Error during scan:' + error.message);
    });
  }

}
