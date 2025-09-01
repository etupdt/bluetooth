import { Injectable } from '@angular/core';
import { BleClient, numberToUUID, ScanMode } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  private readonly HEART_RATE_SERVICE = numberToUUID(0x180d);

  async scan(): Promise<void> {
    try {
      await BleClient.initialize();

      await BleClient.requestLEScan(
        {
          // services: [],
          // name: 'JBL Go 4',
          // scanMode: ScanMode.SCAN_MODE_BALANCED,
          namePrefix: 'JBL',
          allowDuplicates: true,
        },
        result => {
          alert('received new scan result');
        },
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
        alert('stopped scanning');
      }, 50000);
    } catch (error) {
      alert('error')
      console.error(error);
    }

  }

}
