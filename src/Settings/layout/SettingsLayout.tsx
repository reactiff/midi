import React, { useContext } from 'react'
import midiContext from '../../midiContext'
import * as ui from '@reactiff/ui-core'
import DeviceLayout from './DeviceLayout'
import { InternalMidiContextInterface } from '../../types'

const bgStyle = ui.createStripes({
    // bg
    angle: 135,
    colors: ['#00000088', '#00000099'],
    size: 20
  });
  
const shadow = ui.createBoxShadow({ blur: 30, hex: '#00ff0022' }) // dialog

// const grid = ui.useGridSize('material')
// const dialogWidth = ui.logic.switch(
//   grid.value,
//   'calc(100% - 40px)', // default
//   (x) => x >= 3,
//   '800px',
//   (x) => x >= 2,
//   '700px'
// )
  
const dgStyle = {
  boxShadow: shadow['box-shadow'],
  backgroundColor: '#282c34',
  border: '1px solid #88ff8833'
  // width: dialogWidth,
}


const SettingsLayout = () => {

  const midi = useContext(midiContext) as InternalMidiContextInterface;

  return (

    <ui.col fixed fill justifyCenter alignCenter css={bgStyle}>
      <ui.div relative css={dgStyle}>

        {/* DIALOG HEADER */}
        <ui.text
          fontSize='2em'
          color='white'
          bgColor='#111111dd'
          padding='15px 15px 5px 15px'
        >
          MIDI mappings
        </ui.text>

        <ui.div padding='15px 15px 15px 15px'>
          <ui.tabs
            items={midi.controllers}
            keyForItem={(controller) => {
              return controller.device.name
            }}
            elementForItem={(controller, activeTab) => {
              if (!activeTab) return null;
              return <DeviceLayout controller={controller}  /> 
            }}
          />
        </ui.div>
      </ui.div>
    </ui.col>
  )
}

export default SettingsLayout

