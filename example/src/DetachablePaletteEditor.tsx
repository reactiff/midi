import React, { useState } from 'react'
import * as ui from '@reactiff/ui-core'
import { MidiColorPaletteEditor } from '@reactiff/midi'
import { MidiProvider } from '@reactiff/midi'

const DetachablePaletteEditor = () => {

  const [palette, setPalette] = useState<any>({
    primaryColor: 'royalblue',
    secondaryColor: 'pink',
    danger: 'red',
    background: '#eee',
    text: '#333'
  })

  const handleChange = (p: any) => {
    setPalette(p)
  }

  return (
    <MidiProvider>
      <ui.row>
        <ui.col>
          <DesignPreview palette={palette} />
        </ui.col>
        <ui.col>
          <MidiColorPaletteEditor
            id="demo-detachable-color-palette-editor-with-midi-fast-refresh-and-auto-save"
            palette={palette}
            onChange={handleChange}
            detachable={true}
          />
        </ui.col>
      </ui.row>
    </MidiProvider>
  )
}

export default DetachablePaletteEditor

const DesignPreview = (props: any) => {
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
