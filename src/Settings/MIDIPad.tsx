import React, {useState, useEffect, useRef, useMemo} from 'react';
import midiContext, { InternalMidiContextInterface, MidiMappedControl } from '../midiContext';
import ui from '@reactiff/ui-core';
import { MidiControl } from '../initialize/processMidiMessage';
import DeviceController from '../initialize/DeviceController';
import { useCallback } from 'react';

type Props = {
    channel: number,
    control: MidiControl,
    controller: DeviceController,
}

function getControlId(props?: Props) {
    if (!props) return undefined;
    return `ch${props.channel}-${props.control.type}-${props.control.name}`;
}

export default (props: Props) => {
   
    const controlId = getControlId(props);
    const isActive = () => controlId === getControlId(props.controller.activeMapping);
    const [revision, setRevision] = useState(0);
    const rerender = useCallback(() => setRevision(r => r + 1), []);

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
            <ui.div className="center-xy" css={cssBase} onClick={handleClick}>
                <ui.div css={cssKnob} className="center-xy">
                    <span>{props.control.name}</span>
                </ui.div>
            </ui.div>
        </ui.col>
    );
}