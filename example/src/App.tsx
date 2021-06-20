import React from 'react';
import Midi from '@reactiff/midi';
import MidiControlledComponent from './MidiControlledComponent';

import './css/index.css'
import './css/orthogonal.css'
import './css/flex.css'

const App = () => {
    return <Midi>
        <MidiControlledComponent />
    </Midi>
}

export default App;
