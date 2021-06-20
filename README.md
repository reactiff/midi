# @reactiff/midi

React library for interfacing with MIDI controllers

[![NPM](https://img.shields.io/npm/v/@reactiff/midi.svg)](https://www.npmjs.com/package/@reactiff/midi) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
yarn add @reactiff/midi
```

## Usage

```tsx
// App.tsx
import React from 'react'
import Midi, { midiContext, MidiIndicator } from '@reactiff/midi';
import { MidiEventTargetConfiguration } from '@reactiff/midi/dist/initialize/processMidiMessage';
import MyMIDIComponent from './MyMIDIComponent';

const App = () => (
    <Midi>
        <MyMIDIComponent />
        <MidiIndicator />
    </Midi>
)

```

```tsx
// MyMIDIComponent.tsx
import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { midiContext, MidiIndicator } from '@reactiff/midi';
import { MidiEvent, MidiEventTargetConfiguration } from '@reactiff/midi/dist/initialize/processMidiMessage';
import ui from '@reactiff/ui-core';

const config: MidiEventTargetConfiguration = {
    layout: "horizontal",
    channels: 7,
    channelControls: [
        { type: 'selector', name: 'size' },
        { type: 'selector', name: 'step' },
        { type: 'pad', name: 'up' },
        { type: 'pad', name: 'down' },
    ],
    globalGroups: [[
        { type: 'selector', name: 'x' },
        { type: 'selector', name: 'y' },
        { type: 'pad', name: 'enter' },
        { type: 'pad', name: 'exit' },
    ]],
    revision: 1,
};

const createEventHandler = (scope: any) => () => {
       
    const onTouchStart      = (e: MidiEvent) => scope.setTouchState({...e});
    const onAfterTouch      = (e: MidiEvent) => scope.setTouchState({...e});
    const onTouchEnd        = (e: MidiEvent) => scope.setTouchState({...e});
    const onParameterChange = (e: MidiEvent) => scope.updateParamState({...e});

    const target = {
        id: 'MidiControlledComponent',
        config,
        onTouchStart,
        onAfterTouch,
        onTouchEnd,
        onParameterChange
    };

    scope.midi.register(target);

    return () => scope.midi.unregister(target);
};


const MyMIDIComponent = (props: any) => {

    const midi = useContext(midiContext);
    
    const [touchState, setTouchState] = useState<any>({});
    const [paramState, setParamState] = useState<any>({});
    
    const updateTouchState = useCallback((newState: any) => setTouchState(newState), []);
    const updateParamState = useCallback((newState: any) => setParamState(newState), []);

    const scope = {
        midi,
        touchState,
        paramState,
        setTouchState,
        setParamState,
        updateTouchState,
        updateParamState,
    };

    useEffect(
        useMemo(() => 
            createEventHandler(scope), []
        ), []
    );

    return [touchState, paramState].map((obj: any) => <PropsTable object={obj} />)
}

```

## Events

| Event | Description |
| ----- | ----------- |
| onTouchStart | Fired when a pad is tapped or a touch starts |
| onAfterTouch | Fired in rapid succession reflecting changing pressure, when the pad has and is configured to respond to pressure changes.  Check the documentation of your device. |
| onTouchEnd | Fired when a pad touch ends |
| onNoteOn | Fired for each piano key pressed.  If a chord of three notes is played, this event is fired three times |
| onNoteOff | Fired for each piano key released |
| onParameterChange | Fired as a Rotary Knob is turned.  |
| onUnknownEvent | This event will be deprecated in the near future.  Do not use in production. |

            



## Publishing the package to npm

First time (with free account) if scoped, must set access to public
```bash
npm publish --access public
```

To update
```bash
npm version major|minor|patch
```

and then simply
```bash
npm publish
```

---

## License

MIT © [Rick Ellis](https://github.com/reactiff)
