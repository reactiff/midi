import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '@reactiff/ui-core'
import MIDIPad from '../MIDIPad'
import MIDISelector from '../MIDISelector'

const HorizontalControls = (props: any) => {

  const { scope } = props


  return (
    <ui.row>
      {scope.channelNumbers.map((channel, index) => {
        return (
          <ui.col key={`ch${channel}`} spaced alignCenter padding='0 5px'>
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

            {channel > 0 && (
              <ui.div grow fontSize='0.875rem'>
                CH {channel}
              </ui.div>
            )}
          </ui.col>
        )
      })}
    </ui.row>
  )
}

export default HorizontalControls
