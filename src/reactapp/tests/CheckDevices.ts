import { DeviceForm, DeviceType } from '../pages/DeviceForm';
import { DevicesList } from '../pages/DevicesList';
import config from '../support/Config';

fixture `Device Test`
    .page `${config.baseUrl()}`;

test('Fetch Devices', async t => {
    const devices = await DevicesList.getInstance().APIfetchDevices();
    for (const device of devices) {
        await DevicesList.getInstance().verifyDeviceNameTypeAndCapacity(device);
    }
});

test('Create and delete a device', async t => {
    const device = {
        system_name: 'DESKTOP-XYZ',
        hdd_capacity: '512',
        type: DeviceType.Mac
    };
    await DevicesList.getInstance().clickAddDeviceButton();
    await DeviceForm.getInstance().addNewDevice(device);
    await DevicesList.getInstance().verifyDeviceNameTypeAndCapacity(device);
    await DevicesList.getInstance().deleteDevice(device.system_name);
    await DevicesList.getInstance().verifyDeviceIsDeleted(device.system_name);
});

test('Rename first device', async t => {
    const devicesList = DevicesList.getInstance();
    const deviceNames = await devicesList.getAllDeviceNames();
    
    if (deviceNames.length > 0) {
        const originalName = deviceNames[0];
        const originalDevice = await devicesList.APIfetchDeviceByName(originalName);
        const newName = "Renamed Device";
        const newDevice = { system_name: newName, id: originalDevice.id, type: originalDevice.type, hdd_capacity: originalDevice.hdd_capacity };

        await devicesList.APIrenameDevice(newDevice);

        await devicesList.refreshPage();
        await devicesList.verifyDeviceName(newDevice);

        // Restore the original name for cleanup
        await devicesList.APIrenameDevice({ system_name: originalName, id: originalDevice.id, type: originalDevice.type, hdd_capacity: originalDevice.hdd_capacity });
    } else {
        console.log('No devices to rename');
    }
});


test('Delete the last device using API', async t => {
    const devicesList = DevicesList.getInstance();
    const deviceNames = await devicesList.getAllDeviceNames();

    if (deviceNames.length > 0) {
        const lastDevice = await devicesList.APIfetchDeviceByName(deviceNames[deviceNames.length -1]);
        await devicesList.APIdeleteDevice(lastDevice.id);
        await devicesList.refreshPage();
        await devicesList.verifyDeviceIsDeleted(lastDevice.system_name);

        // Restore the deleted device
        await devicesList.APIaddNewDevice(lastDevice);
    } else {
        console.log('No devices to delete');
    }
});

