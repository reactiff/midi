import React, { useCallback, useEffect } from 'react'
import midiContext from '../midiContext'
import ui from '@reactiff/ui-core'

import MIDIPad from './MIDIPad'
import MIDISelector from './MIDISelector'

const { range } = ui.logic

//////////////////////////////////////////////////////////// MIDI SETTINGS

const MidiSettings = (props: any) => {
  // HOOKS
  const midi: any = React.useContext(midiContext)
  const grid = ui.useGridSize('material')
  // see https://www.npmjs.com/package/@reactiff/ui-core
  
  const dialogWidth = ui.logic.switch(
    grid.value,
    'calc(100% - 40px)', // default
    (x) => x >= 3,
    '800px',
    (x) => x >= 2,
    '700px'
  )

  // CALLBACKS //
  const quitNow = useCallback(() => midi.toggleSettings(false), [])
  const onEscapeKey = useCallback((e) => e.keyCode === 27 && quitNow(), [])

  // EFFECTS //

  useEffect(() => {
    // Listen for Esc key
    document.addEventListener('keydown', onEscapeKey, false)
    return () => document.removeEventListener('keydown', onEscapeKey, false)
  }, [])

  // DYNAMIC STYLES //
  const cssBG = React.useMemo(
    () =>
      ui.createStripes({
        // bg
        angle: 135,
        colors: ['#00000088', '#00000099'],
        size: 20
      }),
    []
  )

  const shadow = ui.useBoxShadow({ blur: 30, hex: '#00ff0022' }) // dialog
  const cssDialog = {
    boxShadow: shadow['box-shadow'],
    backgroundColor: '#282c34',
    border: '1px solid #88ff8833',
    // width: dialogWidth,
  }

  if (!midi.settingsOpen) return null
  if (midi.controllers.length === 0) return null // if not ready

  const eventHandler = midi.getEventTarget()
  const config = eventHandler.config;
  const layout = config.layout || 'horizontal';
  const horizontalInverted = layout === 'horizontal' && config.flowDirection === 'inverted';
  const verticalInverted = layout === 'vertical' && config.flowDirection === 'inverted';

  if (horizontalInverted) {
    if (config.channelControls) config.channelControls.reverse();
    if (config.globalGroups) config.globalGroups.forEach(g => g.reverse());
  }
  
  if (verticalInverted) {
    if (config.channelControls) config.channelControls.reverse();
    if (config.globalGroups) config.globalGroups.forEach(g => g.reverse());
  }
  
  return (
    <ui.col fixed fill justifyCenter alignCenter css={cssBG}>
      <ui.div relative css={cssDialog}>
        {/* DIALOG HEADER */}
        <ui.text fontSize='2em' color='white' bgColor='#111111dd' padding='15px 15px 5px 15px'>
          MIDI mappings
        </ui.text>

        <ui.div padding="15px 15px 15px 15px">
          <ui.tabs
            items={midi.controllers}
            keyForItem={(controller) => {
              if (!controller.device) debugger
              return controller.device.name
            }}
            elementForItem={(controller, active) => {

              const VerticalGlobals = config.globalGroups && layout === 'vertical' 
                ? () => (
                  <ui.col marginTop={15} marginBottom={15}>
                    {
                      config.globalGroups.map((g, i) => {
                        return <VerticalLayout key={i} scope={{ 
                          eventHandler, 
                          controller,
                          channelNumbers: [0], 
                          channelControls: g  
                        }}/>
                      })
                    }
                  </ui.col>
                ) : () => null;

              const HorizontalGlobals = config.globalGroups && layout === 'horizontal' 
                ? () => (
                  <ui.row marginLeft={15} marginRight={15}>

                    {
                      config.globalGroups.map((g, i) => {


                        return <HorizontalLayout key={i} scope={{ 
                          eventHandler, 
                          controller,
                          channelNumbers: [0], 
                          channelControls: g,  
                        }}/>
                      })
                    }

                    
                  </ui.row>
                ) : () => null;
                
              const channelNumbers = range(config.channels);

              if (verticalInverted) {
                channelNumbers.reverse();
              }

              return <ui.col>

                <ui.text fontSize='0.7rem' color='white' padding='5px 0 30px 0' textAlign="right">
                  {controller.device.name}
                </ui.text>
                
                {/* For vertical layout, render globals before the row */}

                { !verticalInverted && <VerticalGlobals /> }
                
                <ui.row>
                  
                  { !horizontalInverted && <HorizontalGlobals /> }

                  {
                    layout === 'vertical' &&
                    <VerticalLayout scope={{ 
                      eventHandler, 
                      controller,
                      channelNumbers, 
                      channelControls: config.channelControls  
                    }}/>
                  }

                  {
                    layout === 'horizontal' &&
                    <HorizontalLayout scope={{ 
                      eventHandler, 
                      controller, 
                      channelNumbers, 
                      channelControls: config.channelControls 
                    }}/>
                  }

                  { horizontalInverted && <HorizontalGlobals /> }

                </ui.row>

                { verticalInverted && <VerticalGlobals /> }
                
              </ui.col>
            }}
          />
        </ui.div>
      </ui.div>
    </ui.col>
  )
}

export default MidiSettings

const VerticalLayout = (props: any) => {
  const { scope } = props;
  return (
    <ui.col>
      {
        scope.channelNumbers.map((channel, index) => {
          return (
            <ui.row key={`ch${channel}`} spaced alignCenter padding="5px 0">

              <ui.div grow fontSize="0.875rem">
                {
                  channel > 0 &&
                  <span>CH {channel}</span>
                }  
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
        })
      }
    </ui.col>
  )
}


const HorizontalLayout = (props: any) => {
  const { scope } = props;
  return (
    <ui.row>
      {scope.channelNumbers.map((channel, index) => {
        return (
          
          <ui.col key={`ch${channel}`} spaced alignCenter padding="0 5px">

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

            {
              channel > 0 &&
              <ui.div grow fontSize="0.875rem">CH {channel}</ui.div>
            }
            
          </ui.col>
        )
      })}
    </ui.row>
  )
}
