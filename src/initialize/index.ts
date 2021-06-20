import {requestMidiDevices} from './requestMidiDevices';
import DeviceController from './DeviceController';

/////////////////////////////////////////////////////////////////////// INITIALIZE

export async function initialize(midiContext: any) {

    const detectedDevices = await requestMidiDevices((e: any) => {
    
        let found = false;
        let changes = 0;
        const newList = midiContext.controllers.map((c:any) => {
            if (c.id === e.port.controllerId) {
                found = true;
                const newState = e.port.state === 'connected';
                if (c.connected !== newState) {
                    changes++;
                    c.connected = newState;
                }
                
            }
            if (!c.connected) {
                delete c.device.onmidimessage;
                return null;
            }
            return c;
        }).filter((c:any) => !!c);
    
        if (!found) {
            console.log('New device found');
            newList.push(new DeviceController(e.port, midiContext));
            changes++;
        }
    
        if (changes > 0) {
            midiContext.setControllers(newList);
        }
    
    });

    const devices = detectedDevices
        .filter((d: any) => d.name !== 'loopMIDI Port')
        .map((d: any) => new DeviceController(d, midiContext));

    midiContext.setControllers(devices);


}


