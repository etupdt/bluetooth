import { Injectable, signal } from '@angular/core';
import { BleClient, BleDevice, numbersToDataView, numberToUUID, ScanMode, ScanResult } from '@capacitor-community/bluetooth-le';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  private readonly HEART_RATE_SERVICE = numberToUUID(0x180d);
  private readonly LASER_DEVICCE_ID = 'DC:23:51:0D:3C:C4';

  NAME_CHARACTERISTIC: string = '0000007a-0000-1000-8000-00805f9b34fb';
  SERVICE_1800: number = 0x1800;
  SERVICE_1801: number = 0x1801;
  SERVICE_1910: number = 0x1910;
  CHARACTERISTIC_1800: number = 0x2a00;       // read write
  CHARACTERISTIC_1801: number = 0x2a05;       // read indicate
  CHARACTERISTIC_1810_2b10: number = 0x2b10;  // notify
  CHARACTERISTIC_1810_2b11: number = 0x2b11;  // write write_without

  device: BleDevice = {
    deviceId: '',
    name: '',
    uuids: []
  }
  deviceSignal = signal(this.device);

  // manufacturerData: {[key: string] : DataView<ArrayBufferLike>} {
  //   buffer = new ArrayBuffer(),
  //   byteLength: 0,
  //   byteOffset: 0
  // }
  // serviceData!: {[key: string] : DataView<ArrayBufferLike>}

  readonly enableWiFiCommand = [0x03, 0x17, 0x01, 0x01];

  bluetoothConnectedDevice?: ScanResult;

  async scan(name: string): Promise<void> {
    try {

      await BleClient.initialize();

      await BleClient.requestLEScan(
        {
          name: name,
          allowDuplicates: false,
        },
        result => {

          BleClient.stopLEScan();

          alert(name);

          this.device = result.device
          this.deviceSignal.set(this.device);

        },
      );

      setTimeout(async () => {
        await BleClient.stopLEScan();
      }, 5000);

    } catch (error) {
      alert('error')
      console.error(error);
    }

  }

  async connectToBluetoothDevice(device: BleDevice, disconnect: (deviceId: string) => void): Promise<any> {

    try {

      return BleClient.connect(
        device.deviceId,
        disconnect,
        {}
      )

    } catch (error) {
      console.log('connectToDevice', error);
      alert(JSON.stringify(error));
    }
  }

  async sendBluetoothReadCommand(service: number, characteristic: number): Promise<any> {

    try {
      BleClient.read(
        this.LASER_DEVICCE_ID,
        numberToUUID(service),
        numberToUUID(characteristic)
      )
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`);
      alert(JSON.stringify(error));
    }

  }

async sendBluetoothWriteWithoutCommand(service: number, characteristic: number, data: DataView): Promise<any> {

    try {
      BleClient.write(
        this.LASER_DEVICCE_ID,
        numberToUUID(service),
        numberToUUID(characteristic),
        data
      )
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`);
      alert(JSON.stringify(error));
    }
  }

  async sendBluetoothStartNotificationCommand(service: number, characteristic: number, callback: (value: DataView<ArrayBufferLike>) => void) {

    try {
      await BleClient.startNotifications(
        this.LASER_DEVICCE_ID,
        numberToUUID(service),
        numberToUUID(characteristic),
        callback
      )
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`);
      alert(JSON.stringify(error));
    }
  }

}
