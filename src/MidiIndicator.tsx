import React from 'react'
import midiContext from './midiContext';
import ui from '@reactiff/ui-core';

///////////////////////////////////////////// MIDI INDICATOR 

const MidiIndicator = (props: any) => {
    const midi: any = React.useContext(midiContext);

    const style = { 
        cursor: 'pointer'
    };

    return <button onClick={() => midi.toggleSettings(true)}>
        MIDI
    </button>
}

export default MidiIndicator;