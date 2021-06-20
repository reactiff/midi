import React from 'react';
import DeviceController from './initialize/DeviceController';
import { MidiEventTarget, MidiControl } from './initialize/processMidiMessage';

export type MidiMappedEvent = { 
    command: number, 
    note: number 
};

export type MidiMappedControl = { 
    channel: number,
    control: MidiControl,
    controller: DeviceController,
    rerender: () => void,
};


export type MidiContext = {
    register: (target: MidiEventTarget) => void, 
    unregister: (target: MidiEventTarget) => void, 
};


export interface InternalMidiContextInterface {

    settingsOpen: boolean;
    toggleSettings: (open: boolean) => void;

    controllers: DeviceController[];
    setControllers: (controllers: DeviceController[]) => void;

    getEventTarget: () => MidiEventTarget | undefined; 

    register: (target: MidiEventTarget) => void;
    unregister: (target: MidiEventTarget) => void;

};

const midiContext = React.createContext<MidiContext>({
    register: () => {},
    unregister: () => {},
});
    
export default midiContext;