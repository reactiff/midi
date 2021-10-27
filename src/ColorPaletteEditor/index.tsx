// Color Design
import React, { useCallback, useContext, useEffect, useState, useMemo, ReactNode } from 'react'
import { createMIDIColorManager } from './midiManager';
import PropsTable from '../PropsTable';
import { MIDIColor, MIDIColorPalette } from './types.js';
import midiContext from '../midiContext';
import MidiIndicator from '../MidiIndicator';
import { midiColorLayoutConfig as config } from './midiColorLayoutConfig';
import ColorTable from './ColorTable';

import Detachable, { DetachableContext }  from '../detachable';
import * as ui from '@reactiff/ui-core';

type PaletteChangeHandler = (newPalette: MIDIColorPalette) => void;
type Props = { 
    id?: string,
    title?: string,
    palette: MIDIColorPalette, 
    preview?: ReactNode, 
    onChange: PaletteChangeHandler, 
    detachable?: boolean; 
    _render?: boolean;
};

const ColorPaletteEditor = (props: Props) => {

    const { id, title, preview, onChange, detachable, _render } = props;

    const midi = useContext(midiContext);
    const dcx = useContext(DetachableContext);
    if (detachable && !_render) {
        return (
        <Detachable title={title || 'Color Palette Editor'} id={id}>
            <ui.div padding={12}>
                <ColorPaletteEditor {...props} _render />
            </ui.div>
        </Detachable>
        );
    }

    
    // If detachable, only render when detached and running in new window
    // dcx.role === 'surrogate' can be checked for that
    const detached = dcx.role === "surrogate";
    if  (detachable && !detached) return <ui.div inlineBlock>{title}</ui.div>; 


    // HM, THIS DID NOT FAIL
    const [palette, setPalette] = useState<MIDIColorPalette>(() => props.palette);
    const [colorKey, setColorKey] = useState<string>(() => Object.keys(palette)[0]);

    useEffect(() => {
        midiManager.register(midi);
        return () => midiManager.unregister(midi);
    }, []);

    const updateColor = useCallback((key: string, value: MIDIColor) => {
        setPalette(colors => ({ ...colors, [key]: value }))
    }, []);
    
    const midiManager = useMemo(() => createMIDIColorManager({ updateColor, config: config }), []);
    
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
