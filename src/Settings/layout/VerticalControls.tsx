import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '@reactiff/ui-core'
import MIDIPad from '../MIDIPad'
import MIDISelector from '../MIDISelector'

const VerticalLayout = (props: any) => {
  const { scope } = props
  return (
    <ui.col>
      {scope.channelNumbers.map((channel, index) => {
        return (
          <ui.row key={`ch${channel}`} spaced alignCenter padding='5px 0'>
            <ui.div grow fontSize='0.875rem'>
              {channel > 0 && <span>CH {channel}</span>}
            </ui.div>

            {scope.channelControls.map((control, i) => {
              return control.type === 'pad' ? (
                <MIDIPad
                  key={i}
                  channel={channel}
                  control={control}
                  controller={scope.controller}
                />
              ) : (
                <MIDISelector
                  key={i}
                  channel={channel}
                  control={control}
                  controller={scope.controller}
                />
              )
            })}
          </ui.row>
        )
      })}
    </ui.col>
  )
}

export default VerticalLayout
