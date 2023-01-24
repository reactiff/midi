import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '../../ui'
import DeviceLayout from './DeviceLayout'
import { InternalMidiContextInterface } from '../../types'
  
const dgStyle = {
  backgroundColor: '#282c34',
  border: '1px solid #88ff8833'
}

const SettingsLayout = () => {
  const midi = React.useContext(midiContext) as InternalMidiContextInterface;
  const key = Object.keys(midi.controllers)[0]
  return (

    <ui.col fixed fill justifyCenter alignCenter style={dgStyle}>
      <ui.div relative style={dgStyle}>

        {/* DIALOG HEADER */}
        <h3>
          MIDI mappings
        </h3>

        <ui.div padding='15px 15px 15px 15px'>
          <DeviceLayout controller={midi.controllers}  />
          {/* <ui.tabs
            items={midi.controllers}
            keyForItem={(controller) => {
              return controller.device.name
            }}
            elementForItem={(controller, activeTab) => {
              if (!activeTab) return null;
              return <DeviceLayout controller={controller}  /> 
            }}
          /> */}
        </ui.div>
      </ui.div>
    </ui.col>
  )
}

export default SettingsLayout

