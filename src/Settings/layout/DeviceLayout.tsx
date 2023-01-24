import React from 'react'
import midiContext from '../../midiContext'
import * as ui from '../../ui'
import MIDIPad from '../MIDIPad'
import MIDISelector from '../MIDISelector'
import { InternalMidiContextInterface } from '../../types'

import HorizontalStack from './HorizontalStack';

type Props = { controller: any };

const DeviceLayout = (props: Props) => {

  const midi = React.useContext(midiContext) as InternalMidiContextInterface;
  
  const eventHandler = midi.getEventTarget()!;
  const config = eventHandler.config;

  const layout = config.layout || 'horizontal';
  const inverted = config.flowDirection === 'inverted';

  if (inverted) {
    if (config.channelControls) config.channelControls.reverse()
    if (config.globalGroups) config.globalGroups.forEach((g) => g.reverse())
  }

  return <React.Fragment>
    {
      layout === 'horizontal' && <HorizontalStack controller={props.controller} /> 
    }
    {
      layout === 'vertical' && React.createElement('VerticalStack', props) 
    }
  </React.Fragment>;
}

export default DeviceLayout
