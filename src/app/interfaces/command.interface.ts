import { BleDevice } from "@capacitor-community/bluetooth-le"

export interface Command {
    type: string,
    deviceName?: string,
    device?: BleDevice,
    service?: number,
    characteristic?: number,
    callback?: (param1?: any, param2?: any) => void
    data?: string,
}
