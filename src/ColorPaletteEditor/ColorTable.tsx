import React from 'react'
import * as ui from '../ui';
import { MIDIColorPalette } from './types';
import W3Color from './w3color';

const ColorTable = (props: { palette: MIDIColorPalette, onSelect?: Function }) => {
    
    const { palette, onSelect } = props;


    const keys = Object.keys(palette);
    const handleSelect = (key: string) => {
        
        onSelect && onSelect(key)
    }
    return <ui.col marginTop={10}>
        {keys.map(k => {
            return <ColorSwatch key={k} color={palette[k]} onClick={() => handleSelect(k)} />
        })}
    </ui.col>
}

export default ColorTable;

const ColorSwatch = (props: any) => {

    const { color } = props;

    const displayName = color instanceof W3Color ? color.toHexString() : color;

    const style = {
        height: '10vw',
        backgroundColor: color instanceof W3Color ? color.toHexString() : color,
    };

    return <ui.row style={style} onClick={() => {
        props.onClick && props.onClick()
    }}>
        { displayName }
    </ui.row>
}