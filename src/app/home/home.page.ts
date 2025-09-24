import { Component, effect } from '@angular/core';
import { IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonLabel, 
  IonItem,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { BleService } from '../services/ble-service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { numbersToDataView } from '@capacitor-community/bluetooth-le';
import { Command } from '../interfaces/command.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButton, 
    IonLabel, 
    IonItem,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    CommonModule,
    FormsModule
  ],
})
export class HomePage {

  constructor(
    public bleService: BleService
  ) {
    effect(() => {
      alert(`The current device is: ${this.device.name}`);
    });
  }

  // data: DataView = numbersToDataView([0x12, 0x0d, 0x00, 0x01, 0x00])
  data: DataView = numbersToDataView([0x12, 0x0d, 0x00, 0x01, 0x00])
  
  steps: Command[] = [
    {type: 'scan', deviceName: 'TY'},
    {type: 'connect', device: this.device},
    {type: 'read', service: 0x1800, characteristic: 0x2a00},
    {type: 'writeWithout', service: 0x1800, characteristic: 0x2a00, data: '12 0d 00 01 00'},
    // {type: 'write', service: 0x1800, characteristic: 0x2a00, data: '12 0d 00 01 00'},
  ]

  characteristics: string[] = [
    's 1800 c 2a00',
    's 1801 c 2a05',
    's 1910 c 2b10',
    's 1910 c 2b11'
  ]

  characteristicsValues: number[][] = [
    [0x1800, 0x2a00],
    [0x1801, 0x2a05],
    [0x1910, 0x2b10],
    [0x1910, 0x2b11]
  ]

  selectedCharacteristicNumber: number = 0
  selectedCharacteristic: string = this.characteristics[this.selectedCharacteristicNumber]

  log: string = 'Début application'

  startBle() {
    this.bleService.scan('TY').then(() => {
      this.log += '\nBluetooth =====> scan started';
    }).catch(error => {
      alert('Error during scan:' + error.message);
    });
  }

  connect() {
    this.bleService.connectToBluetoothDevice(this.device, this.onBluetooDeviceDisconnected).then(() => {
        alert('Bluetooth =====> connected to ' + this.device.deviceId);
      }).catch(error => {
        alert('Error during connect:' + error.message);
      });
  }

  read(service: number, characteristic: number) {
    this.bleService.sendBluetoothReadCommand(service, characteristic).then((dataView: DataView) => {
        alert('Bluetooth =====> data readed ' + this.displayDataView(dataView));
      }).catch(error => {
        alert('Error during read:' + error.message);
      });
  }

  writeWithoutResponse(service: number, characteristic: number) {
    this.bleService.sendBluetoothWriteWithoutCommand(service, characteristic, this.data).then(() => {
        alert('Bluetooth =====> data write without req ');
      }).catch(error => {
        alert('Error during write without req:' + error.message);
      });
  }

  notify(service: number, characteristic: number) {
    this.bleService.sendBluetoothStartNotificationCommand(service, characteristic, this.onNotification).then(() => {
        alert('Bluetooth =====> notifications returned ');
      }).catch(error => {
        alert('Error during notification:' + error.message);
      });
  }

  indicate() {

  }

  get device() {return this.bleService.device};

  serviceData(service: number): string {
    const data: DataView = Object.values(this.serviceData!)[service];
    return data.byteOffset.toString() + '  ' + data.byteLength.toString() + '  ' + this.parseData(data) + ' ';
  }

  parseData(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let data: number;
    if (rate16Bits > 0) {
      data = value.getUint16(1, true);
    } else {
      data = value.getUint8(1);
    }
    return data;
  }

  onNotification(dataView: DataView) {
    alert('notification received');
  }

  onBluetooDeviceDisconnected(disconnectedDeviceId: string) {
    alert(`Disconnected ${disconnectedDeviceId}`);
  }

  displayDataView (data: DataView): string {
    let result: string = '';
    Array.prototype.forEach.call(new Int8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)), (x) => result += ' ' + x)
    return data.byteOffset.toString() + '  ' + data.byteLength.toString() + ' x' + result + 'x ';
  }

}
