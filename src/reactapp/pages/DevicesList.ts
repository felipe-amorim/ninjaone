import { Selector, t } from 'testcafe';
import config from '../support/Config';
import axios from 'axios';

export class DevicesList {
    private static instance: DevicesList;
    private constructor() { }  // Private constructor to prevent direct class instantiation

    /**
     * Returns the singleton instance of the DevicesList class.
     * If an instance does not exist, a new instance is created.
     * @returns The singleton instance of the DevicesList class.
     */
    public static getInstance(): DevicesList {
        if (!DevicesList.instance) {
            DevicesList.instance = new DevicesList();
        }
        return DevicesList.instance;
    }

    //LOCATORS
    private addDeviceButton = Selector('a[href="/devices/add"]');
    private systemNameSelector = Selector('.device-main-box .device-name');

    private getDeviceSelector(deviceName: string) {return Selector('.device-main-box').withText(deviceName);}
    private getDeviceRemoveButton(parent: Selector) {return parent.find('.device-remove');}
    private getDeviceEditButton(parent: Selector) {return parent.find('.device-edit');}
    private getDeviceCapacity(parent: Selector) {return parent.find('.device-capacity');}
    private getDeviceType(parent: Selector) {return parent.find('.device-type');}


    // UI METHODS
    /**
     * Clicks the add device button.
     */
    public async clickAddDeviceButton() {
        await t.click(this.addDeviceButton);
    }

    /**
     * Verifies the device name, type, and capacity.
     * 
     * @param {object} device - The device object to verify.
     */
    public async verifyDeviceNameTypeAndCapacity(device) {
        const deviceSelector = this.getDeviceSelector(device.system_name);
        await t
            .expect(this.getDeviceType(deviceSelector).innerText).eql(device.type, `Type does not match for ${device.system_name}`)
            .expect(this.getDeviceCapacity(deviceSelector).innerText).eql(`${device.hdd_capacity} GB`, `Capacity does not match for ${device.system_name}`)
        this.verifyDeviceName(device);
    }

    /**
     * Verifies the existence of a device with the specified name and checks if it has an edit button and a remove button.
     * @param device - The device object to verify.
     */
    public async verifyDeviceName(device) {
        const deviceSelector = this.getDeviceSelector(device.system_name);
        await t
            .expect(deviceSelector.visible).ok(`Device with name ${device.system_name} does not exist.`)
            .expect(this.getDeviceEditButton(deviceSelector).exists).ok(`Device with name ${device.system_name} does not have an edit button.`)
            .expect(this.getDeviceRemoveButton(deviceSelector).exists).ok(`Device with name ${device.system_name} does not have a remove button.`)
    }

    /**
     * Retrieves the names of all devices.
     * @returns A promise that resolves to an array of device names.
     */
    public async getAllDeviceNames(): Promise<string[]> {
        const count = await this.systemNameSelector.count;
        let deviceNames: string[] = [];
        
        for (let i = 0; i < count; i++) {
            const name = await this.systemNameSelector.nth(i).innerText;
            deviceNames.push(name);
        }

        return deviceNames;
    }

    /**
     * Deletes a device with the specified device name.
     * 
     * @param deviceName - The name of the device to delete.
     */
    public async deleteDevice(deviceName: string) {
        const deviceSelector = this.getDeviceSelector(deviceName);
        const removeButton = this.getDeviceRemoveButton(deviceSelector);

        await t.click(removeButton);
    }

    /**
     * Verifies if a device with the specified name is deleted.
     * @param deviceName - The name of the device to verify.
     */
    public async verifyDeviceIsDeleted(deviceName: string) {
        const deviceSelector = this.getDeviceSelector(deviceName);
        await t.expect(deviceSelector.exists).notOk(`Device with name ${deviceName} is still visible after deletion.`);
    }
    
    /**
     * Refreshes the page by reloading the current location.
     */
    public async refreshPage() {
        await t.eval(() => location.reload());
    }

    //API METHODS
    /**
     * Fetches devices from the API.
     * @returns A Promise that resolves to the fetched devices.
     * @throws If there is an error while fetching the devices.
     */
    public async APIfetchDevices(): Promise<any> {
        try {
            const response = await axios.get(config.apiUrlDevices(), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch devices:', error);
            throw error;
        }
    }

    /**
     * Fetches a device by its name from the API.
     * @param deviceName - The name of the device to fetch.
     * @returns A Promise that resolves to the device object if found, or null if not found.
     */
    public async APIfetchDeviceByName(deviceName: string): Promise<any | null> {
        const devices = await this.APIfetchDevices();
        return devices.find(d => d.system_name === deviceName) || null;
    }

    /**
     * Renames a device by making an API call to update the device information.
     * @param device - The device object containing the updated information.
     * @throws If there is an error while renaming the device.
     */
    public async APIrenameDevice(device): Promise<void> {
        try {
            const url = `${config.apiUrlDevices()}/${device.id}`; // Assuming you have a specific endpoint to hit for device updates
            const response = await axios.put(url, {
                system_name: device.system_name,
                hdd_capacity: device.hdd_capacity,
                type: device.type
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error renaming device:', error);
            throw error;
        }
    }

    /**
     * Adds a new device to the API.
     * 
     * @param {object} device - The device object containing the system_name, hdd_capacity, and type properties.
     * @throws {Error} - If there is an error while adding the device.
     */
    public async APIaddNewDevice(device): Promise<void> {
        try {
            const url = `${config.apiUrlDevices()}`; // Assuming you have a specific endpoint to hit for device updates
            const response = await axios.post(url, {
                system_name: device.system_name,
                hdd_capacity: device.hdd_capacity,
                type: device.type
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error creating device:', error);
            throw error;
        }
    }

    /**
     * Deletes a device using the API.
     * @param {string} deviceId - The ID of the device to delete.
     * @throws {Error} - If there is an error deleting the device.
     */
    public async APIdeleteDevice(deviceId: string): Promise<void> {
        try {
            const url = `${config.apiUrlDevices()}/${deviceId}`;
            const response = await axios.delete(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error deleting device:', error);
            throw error; 
        }
    }

}
