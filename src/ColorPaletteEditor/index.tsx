// Color Design
import React from 'react'
import { createMIDIColorManager } from './midiManager';
import { MIDIColor, MIDIColorPalette } from './types.js';
import midiContext from '../midiContext';
import MidiIndicator from '../MidiIndicator';
import { midiColorLayoutConfig as config } from './midiColorLayoutConfig';
import ColorTable from './ColorTable';

type PaletteChangeHandler = (newPalette: MIDIColorPalette) => void;
type Props = { 
    id?: string,
    title?: string,
    palette: MIDIColorPalette, 
    preview?: React.ReactNode, 
    onChange: PaletteChangeHandler, 
    _render?: boolean;
};

const ColorPaletteEditor = (props: Props) => {

    const { id, title, preview, onChange, _render } = props;

    const midi = React.useContext(midiContext);

    const [palette, setPalette] = React.useState<MIDIColorPalette>(() => props.palette);
    const [colorKey, setColorKey] = React.useState<string>(() => Object.keys(palette)[0]);

    React.useEffect(() => {
        midiManager.register(midi);
        return () => midiManager.unregister(midi);
    }, []);

    const updateColor = React.useCallback((key: string, value: MIDIColor) => {
        setPalette(colors => ({ ...colors, [key]: value }))
    }, []);
    
    const midiManager = React.useMemo(() => createMIDIColorManager({ updateColor, config: config }), []);
    
    const handleSelectColor = (key: string) => {
        midiManager.selectColor(colorKey, palette[colorKey]);
        setColorKey(key);
    }

    return <React.Fragment>
        <MidiIndicator />
        <ColorTable palette={palette} onSelect={handleSelectColor}/>
    </React.Fragment>
}

export default ColorPaletteEditor;
