import React from 'react'
import * as ui from '../../ui'
import MIDIPad from '../MIDIPad'
import MIDISelector from '../MIDISelector'

const HorizontalNamedControlGroups = (props: any) => {

  const { 
    eventHandler, 
    controller, 
    config 
  } = props.scope;
  
  
  const { rows } = config;

  const groupKeys = Object.keys(rows);


  return (
    <ui.col>
      {rows.map((row, rIndex) => {

        const controls = row;
        let prevGroup = null;

        return (

          
          <ui.row key={`row${rIndex}`} spaced alignCenter padding='0 5px'>

            {controls.map((ctl, i) => {

              const caption = !!ctl.group && ctl.group !== prevGroup ? ctl.group : null;
              const captionStyle = {
                height: 20,
                // ...(caption ? { borderBottom: '1px solid black' } : {}),
                
              };

              prevGroup = ctl.group;

              return <ui.col key={i}>

                <ui.div style={captionStyle} >
                  {caption}
                </ui.div>

                {
                  ctl.type === 'pad' ? (
                    <MIDIPad
                      key={i}
                      control={ctl}
                      controller={controller}
                    />
                  ) : (
                    <MIDISelector
                      key={i}
                      control={ctl}
                      controller={controller}
                    />
                  )
                }
                
              </ui.col>
              
              
            })}

            
           
            
          </ui.row>
        )
      })}
    </ui.col>
  )
}

export default HorizontalNamedControlGroups
