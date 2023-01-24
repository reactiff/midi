import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '../../ui'
import HorizontalControls from './HorizontalControls'
import { InternalMidiContextInterface } from '../../types'
import HorizontalNamedControlGroups from './HorizontalNamedControlGroups'

const HorizontalStack = (props: any) => {

  const { controller } = props

  const midi = React.useContext(midiContext) as InternalMidiContextInterface;
  const eventHandler = midi.getEventTarget()!;
  const config = eventHandler.config;
  const inverted = config.flowDirection === 'inverted';
 
  const channelNumbers = Array.from(
    { length: config.channels || 0 },
    (a, i) => i + 1
  )
 

  const HGlobals = !!config.globalGroups
      ? () => {

          return <ui.row marginLeft={15} marginRight={15}>
            {config.globalGroups!.map((g, i) => {
              return (
                <HorizontalControls
                  key={i}
                  scope={{
                    annotation: "from globalGroups (see data)",
                    data: config.globalGroups,
                    eventHandler,
                    controller,
                    channelNumbers: [0],
                    channelControls: g
                  }}
                />
              )
            })}
          </ui.row>
      }
      : () => null


  return <ui.col>

    <strong style={{fontSize: '0.7rem', color: 'white', padding: '5px 0 30px 0', textAlign: "right"}}>
      {controller.device.name}
    </strong>
    
    {/* For vertical layout, render globals before the row */}
    {/* { !verticalInverted && <VerticalGlobals /> } */}
    
    <ui.row>
      
      { !inverted && <HGlobals /> }

      {
        // ORIGINAL IMPL
        config.channels && 
        <HorizontalControls scope={{ 
          eventHandler, 
          controller, 
          channelNumbers, 
          channelControls: config.channelControls 
        }}/>
      }
    
      {
        // NEW - NAMED GROUPS for color, i.e. rgb, cmyk, hsl, hwb
        config.rows && 
        <HorizontalNamedControlGroups scope={{ 
          eventHandler, 
          controller, 
          config
        }}/>
        
      }

      { inverted && <HGlobals /> }

    </ui.row>

  </ui.col>
}


export default HorizontalStack
