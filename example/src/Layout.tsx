import React from 'react'
import { MidiIndicator } from '@reactiff/midi';

import ui from '@reactiff/ui-core';
import { StripeOptionsType } from '@reactiff/ui-core/dist/hooks/stripes';

/////////////////////////////////////////////////////////////////////// EXAMPLE - LAYOUT

const MidiControlledComponent = (props: any) => {

    return <ui.col minHeight="100vh">

        <ui.div absolute top={30} left={30}>
            <h1>MIDI</h1>
            <p>
                React library for interfacing with MIDI controllers
            </p>
            <a href="https://www.npmjs.com/package/@reactiff/midi"><img src="https://img.shields.io/npm/v/@reactiff/midi.svg" alt="NPM"/></a>
            <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"/></a>
            <br/>
            MIT © <a href="https://github.com/reactiff">Rick Ellis</a>
        </ui.div>

        <ui.row grow alignCenter justifyCenter>
            {props.children}
        </ui.row>
        <ui.row padding={5}>
            <ui.div grow />
            <MidiIndicator />
        </ui.row>
    </ui.col>
}

export default MidiControlledComponent;
