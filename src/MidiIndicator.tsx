import React from 'react'
import midiContext from './midiContext';

///////////////////////////////////////////// MIDI INDICATOR 

const MidiIndicator = (props: any) => {
    const midi: any = React.useContext(midiContext);

    return <button 
        style={{
            backgroundColor: 'transparent',
            border: '2px solid yellowgreen',
            borderRadius: 3,
            color: 'yellowgreen',
            cursor: 'pointer'
        }}
        onClick={() => midi.toggleSettings(true)}>
        MIDI
    </button>
}

export default MidiIndicator;