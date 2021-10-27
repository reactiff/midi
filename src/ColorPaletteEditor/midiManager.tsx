import { MIDIColor } from './types';
import Throttle from './Throttle';
import { processMidiEvent } from './processMidiEvent';
import { MidiEventTargetConfiguration, MidiEvent } from '../types';

export type MIDIColorManagerState = {
    selectedColor: { key: string, value?: MIDIColor },
    model: { 
        rgba: [number, number, number, number],
        cmyk: [number, number, number, number],
        hsla: [number, number, number],
        hwba: [number, number, number],
        latest: string,
    },
    keyState: {
        shiftKey: boolean,
        ctrlKey: boolean,
        altKey: boolean
    },
    updateColor: (color: MIDIColor) => void,
    config: MidiEventTargetConfiguration,
};

type MIDIColorManagerScope = { 
    config: MidiEventTargetConfiguration,  
    updateColor: (key: string, value: MIDIColor) => void; 
}

export const createMIDIColorManager = (scope: MIDIColorManagerScope) => {
    const state = createState(scope);
    const midiTarget = createMidiTarget(state);
    const keyboardHandler = createKeyboardHandler(state);
   
    return {
        selectColor(key: string, value: MIDIColor) {
            state.selectedColor.key = key;
            state.selectedColor.value = value;
        },
        register(midiContext: any) {
            midiContext.register(midiTarget)
            document.addEventListener('keydown', keyboardHandler, false);
            document.addEventListener('keyup', keyboardHandler, false);
        },
        unregister(midiContext: any) {
            midiContext.unregister(midiTarget);
            document.removeEventListener('keydown', keyboardHandler, false);
            document.removeEventListener('keyup', keyboardHandler, false);
        }
    };
};


function createState(scope: MIDIColorManagerScope) {
    const state: MIDIColorManagerState = {
        selectedColor: {
            key: '',
            value: null,
        },
        model: {
            rgba: [0, 0, 0, 1],
            cmyk: [0, 0, 0, 0],
            hsla: [0, 0, 0],
            hwba: [0, 0, 0],
            latest: '',
        },
        keyState: {
            shiftKey: false,
            ctrlKey: false,
            altKey: false
        },
        updateColor: (color: any) => {
            state.selectedColor.value = color;
            scope.updateColor(state.selectedColor.key, color)
        },
        config: scope.config,
    };
    return state;
}


function createMidiTarget(state: MIDIColorManagerState) {
    
    const onTouchStart      = (e: MidiEvent) => {  };
    const onAfterTouch      = (e: MidiEvent) => {  };
    const onTouchEnd        = (e: MidiEvent) => {  };
    
    const target = {
        throttle: new Throttle(),
        id: 'MIDIColorManager',
        config: state.config,
        onParameterChange: (e: any) => {
            
            target.throttle.invokeWithAnimationFrame(
                processMidiEvent, 
                e, 
                state
            )
        },
        onTouchStart,   
        onTouchEnd,   
        onAfterTouch,   
    }
    return target;
}

function createKeyboardHandler(state: MIDIColorManagerState) {
    return (e: any) => { 
        e.stopPropagation();
        state.keyState.shiftKey = e.shiftKey;
        state.keyState.altKey = e.altKey;
        state.keyState.ctrlKey = e.ctrlKey;
        return false;
    };
}
    