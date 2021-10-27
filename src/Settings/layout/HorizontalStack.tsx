import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '@reactiff/ui-core'
import MIDIPad from '../MIDIPad'
import MIDISelector from '../MIDISelector'
import HorizontalControls from './HorizontalControls'
import { InternalMidiContextInterface } from '../../types'
import HorizontalNamedControlGroups from './HorizontalNamedControlGroups'

const HorizontalStack = (props: any) => {

  const { controller } = props

  const midi = React.useContext(midiContext) as InternalMidiContextInterface;
  const eventHandler = midi.getEventTarget()!;
  const config = eventHandler.config;
  const inverted = config.flowDirection === 'inverted';

  // scope={{
  //   eventHandler,
  //   controller,
  //   channelNumbers: [0],
  //   channelControls: g
  // }}

  // const VerticalGlobals =
  //   config.globalGroups && layout === 'vertical'
  //     ? () => (
  //         <ui.col marginTop={15} marginBottom={15}>
  //           {config.globalGroups.map((g, i) => {
  //             return (
  //               <VerticalLayout
  //                 key={i}
  //                 scope={{
  //                   eventHandler,
  //                   controller,
  //                   channelNumbers: [0],
  //                   channelControls: g
  //                 }}
  //               />
  //             )
  //           })}
  //         </ui.col>
  //       )
  //     : () => null

  
  const channelNumbers = Array.from(
    { length: config.channels || 0 },
    (a, i) => i + 1
  )
  // if (layout === 'vertical') {
  //   channelNumbers.reverse()
  // }



  

 

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

    <ui.text fontSize='0.7rem' color='white' padding='5px 0 30px 0' textAlign="right">
      {controller.device.name}
    </ui.text>
    
    {/* For vertical layout, render globals before the row */}
    {/* { !verticalInverted && <VerticalGlobals /> } */}
    
    <ui.row>
      
      { !inverted && <HGlobals /> }

      {/* {
        layout === 'vertical' &&
        <VerticalLayout scope={{ 
          eventHandler, 
          controller,
          channelNumbers, 
          channelControls: config.channelControls  
        }}/>
      } */}


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

    {/* { verticalInverted && <VerticalGlobals /> } */}
    
  </ui.col>
}


export default HorizontalStack
