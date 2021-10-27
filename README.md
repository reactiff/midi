# @reactiff/midi

React library for interfacing with MIDI controllers

[![NPM](https://img.shields.io/npm/v/@reactiff/midi.svg)](https://www.npmjs.com/package/@reactiff/midi) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

Big news!  Version 2.0 now supports ColorPaletteEditor!

```bash
yarn add @reactiff/midi
```

## Usage

```tsx
import { useState } from 'react'
import * as ui from '@reactiff/ui-core'
import { MidiColorPaletteEditor } from '@reactiff/midi'
import { MidiProvider } from '@reactiff/midi'

export default const DetachablePaletteEditor = () => {

  const [palette, setPalette] = useState<any>({
    primaryColor: 'royalblue',
    secondaryColor: 'pink',
    danger: 'red',
  })

  const handleChange = (p: any) => {
    setPalette(p)
  }

  return (
    <MidiProvider>
      <ui.row>
        <ui.col>
          <HotPreview palette={palette} />
        </ui.col>
        <ui.col>
          <MidiColorPaletteEditor
            id="demo-detachable-color-palette-editor-with-midi-fast-refresh-and-auto-save"
            palette={palette}
            onChange={setPalette}
            detachable={true}
          />
        </ui.col>
      </ui.row>
    </MidiProvider>
  )
}
```

You can supply your own Preview, which used the palette, or update the whote Theme to see changes everywhere!
```tsx
const HotPreview = (props: any) => {
  const { palette } = props
  return (
    <ui.col>
      <ui.div>Header</ui.div>
      <ui.div>
        <p>{ui.loremIpsum.paragraphs(1)}</p>
      </ui.div>
      <ui.div>
        <button>Primary</button>
        <button>Secondary</button>
      </ui.div>
    </ui.col>
  )
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
