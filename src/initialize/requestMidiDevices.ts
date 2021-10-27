export function requestMidiDevices(onStateChange?: Function) {
    
    return new Promise<any>((resolve, reject) => {

        const navi: {requestMIDIAccess?: Function} = navigator as any;

        if (navi.requestMIDIAccess) {
            navi.requestMIDIAccess().then(

                
                (midiAccess: any) => {

                    
                    const inputs = midiAccess.inputs.values();
                    const devices: any[] = [];
                    for (let device of inputs) {
                        devices.push(device);
                    }

                    if (onStateChange) {
                        midiAccess.onstatechange = onStateChange;
                    }

                    resolve(devices);
                }, 

                () => console.log('Could not access your MIDI devices.'),

            );
        } 
        
    });
}


