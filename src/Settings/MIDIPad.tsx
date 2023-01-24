import React from 'react';
import * as ui from '../ui';
import DeviceController from '../initialize/DeviceController';
import { MidiControl, MidiMappedControl } from '../types';
import { getControlId } from './getControlId';


type Props = {
    channel?: number,
    control: MidiControl,
    controller: DeviceController,
    number?: number,
}

function MIDIPad(props: Props) {
   
    const controlId = getControlId(props.control);

    const am = props.controller.activeMapping!;
    const isActive = () => !!am && controlId === getControlId(am && am.control);

    const [revision, setRevision] = React.useState(0);
    const rerender = React.useCallback(() => setRevision(r => r + 1), []);

    const mappedControl: MidiMappedControl = { 
        ...props,
        rerender,
    };

    // CALLBACKS //
    const handleClick = () => {
        if (!isActive()) {
            props.controller.beginMapping(mappedControl);
        }
        else {
            props.controller.cancelMapping();
        }
    }

    // THESE FLAGS WILL DRIVE APPEARANCE
    // Is this control mapped?
    const mappedEvent = props.controller.getMappedEventData(controlId);
    const mapped = !!mappedEvent;

    // Is it Active now?
    const active = isActive();

    const cssBase: any = {
        width: 60,
        height: 60,
        padding: 0,
        borderRadius: '3px',
        cursor: 'pointer',
        backgroundColor: mapped ? '#16c793' : '#000000',
    };
    
    const cssKnob: any = {
        width: 58,
        height: 58,
        borderRadius: '3px',
        borderColor: '#000',
        backgroundColor: mapped ? '#08251c' : '#777777',
        fontSize: "0.55rem",
    };
  
    if (active) {
        cssKnob.backgroundColor = mapped ? '#00ffff' : '#0055ff'
        cssKnob.color = '#000'
    }

    return (
        <ui.col alignCenter>
            <ui.div className="center-xy" style={cssBase} onClick={handleClick}>
                <ui.div style={cssKnob} className="center-xy">
                    <span>{props.control.name}</span>
                </ui.div>
            </ui.div>
        </ui.col>
    );
}

export default MIDIPad;