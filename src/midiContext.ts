import React from 'react';
import { MidiEventTarget } from './types';

type MidiContext = {
    register: (target: MidiEventTarget) => void, 
    unregister: (target: MidiEventTarget) => void, 
  };
  
const midiContext = React.createContext<MidiContext>({
    register: (target) => { 
        throw new Error(`Event target '${target.id} is not running inside a valid MIDI context.  Make sure to place MIDI components inside <MidiProvider> tag`);
    },
    unregister: (target) => { throw new Error('') },
});
    
export default midiContext;