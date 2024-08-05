import { Selector, t } from 'testcafe';

/**
 * Represents the types of devices.
 */
export enum DeviceType {
    WindowsWorkstation = 'WINDOWS_WORKSTATION',
    WindowsServer = 'WINDOWS_SERVER',
    Mac = 'MAC'
}

export class DeviceForm {
    private static instance: DeviceForm;
    private constructor() { }  // Private constructor to prevent direct class instantiation

    /**
     * Returns the singleton instance of the DeviceForm class.
     * If an instance does not exist, a new instance is created.
     * @returns The singleton instance of the DeviceForm class.
     */
    public static getInstance(): DeviceForm {
        if (!DeviceForm.instance) {
            DeviceForm.instance = new DeviceForm();
        }
        return DeviceForm.instance;
    }

    //LOCATORS
    private systemNameInput = Selector('#system_name');
    private hddCapacityInput = Selector('#hdd_capacity');
    private typeSelector = Selector('#type');
    private typeOptionWindowsWorkstation = Selector('option[value="WINDOWS_WORKSTATION"]');
    private typeOptionWindowsServer = Selector('option[value="WINDOWS_SERVER"]');
    private typeOptionMac = Selector('option[value="MAC"]');
    private submitButton = Selector('.submitButton');

    //UI METHODS
    /**
     * Adds a new device to the system.
     * @param {object} device - The device object containing the device information.
     * @param {string} device.system_name - The system name of the device.
     * @param {string} device.hdd_capacity - The HDD capacity of the device.
     * @param {DeviceType} device.type - The type of the device.
     * @throws {Error} If the device type is unsupported.
     */
    public async addNewDevice(device) {
        await t
            .typeText(this.systemNameInput, device.system_name, { replace: true })
            .typeText(this.hddCapacityInput, device.hdd_capacity, { replace: true });

        await t.click(this.typeSelector);
        switch(device.type) {
            case DeviceType.WindowsWorkstation:
                await t.click(this.typeOptionWindowsWorkstation);
                break;
            case DeviceType.WindowsServer:
                await t.click(this.typeOptionWindowsServer);
                break;
            case DeviceType.Mac:
                await t.click(this.typeOptionMac);
                break;
            default:
                throw new Error(`Unsupported device type: ${device.type}`);
        }

        await t.click(this.submitButton);
    }
}