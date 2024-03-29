import React from 'react';
import ColorPaletteEditor from '.';
import { MIDIColorPalette } from './types';

import * as ui from '../ui';

const ColorPaletteEditorDemo = () => {
    
    const [palette, setPalette] = React.useState<MIDIColorPalette>({
        primaryColor: 'royalblue',
        secondaryColor: 'pink',
        danger: 'red',
        background: '#eee',
        text: '#333',
    });

    return <ColorPaletteEditor 
        palette={palette} 
        onChange={setPalette} 
        preview={<DesignPreview palette={palette} />}
    />    
    
}

export default ColorPaletteEditorDemo;



const DesignPreview = (props: any) => {

    const { palette } = props;

    return (
        <ui.col>

            <ui.div>Header</ui.div>

            <ui.div>
                <p>
                    Wah wah wah
                </p>
            </ui.div>

            <ui.div>

                <button>Primary</button>
                <button>Secondary</button>

            </ui.div>

        </ui.col>
    )
}