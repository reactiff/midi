import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react'
import { midiContext, MidiIndicator } from '@reactiff/midi';
import { MidiEvent, MidiEventTargetConfiguration } from '@reactiff/midi/dist/initialize/processMidiMessage';
import Layout from './Layout';
import PropsTable from './PropsTable';
import ui from '@reactiff/ui-core';

const config: MidiEventTargetConfiguration = {
    layout: "horizontal",
    channels: 7,
    channelControls: [
        { type: 'selector', name: 'size' },
        { type: 'selector', name: 'step' },
        { type: 'pad', name: 'up' },
        { type: 'pad', name: 'down' },
    ],
    globalGroups: [[
        { type: 'selector', name: 'x' },
        { type: 'selector', name: 'y' },
        { type: 'pad', name: 'enter' },
        { type: 'pad', name: 'exit' },
    ]],
    revision: 1,
};

const createEventHandler = (scope: any) => () => {
       
    const onTouchStart      = (e: MidiEvent) => scope.setTouchState({...e});
    const onAfterTouch      = (e: MidiEvent) => scope.setTouchState({...e});
    const onTouchEnd        = (e: MidiEvent) => scope.setTouchState({...e});
    const onParameterChange = (e: MidiEvent) => scope.updateParamState({...e});

    const target = {
        id: 'MidiControlledComponent',
        config,
        onTouchStart,
        onAfterTouch,
        onTouchEnd,
        onParameterChange
    };

    scope.midi.register(target);

    return () => scope.midi.unregister(target);
};


const MidiControlledComponent = (props: any) => {

    const midi = useContext(midiContext);
    
    const [touchState, setTouchState] = useState<any>({});
    const [paramState, setParamState] = useState<any>({});
    
    const updateTouchState = useCallback((newState: any) => setTouchState(newState), []);
    const updateParamState = useCallback((newState: any) => setParamState(newState), []);

    const scope = {
        midi,
        touchState,
        paramState,
        setTouchState,
        setParamState,
        updateTouchState,
        updateParamState,
    };

    useEffect(
        useMemo(() => 
            createEventHandler(scope), []
        ), []
    );
    
    const keyCount = Object.keys(touchState).length + Object.keys(paramState).length;

    return <Layout>
        {
            !keyCount && <h3>Touch your MIDI device's mapped controls to see stuff happening...</h3>
        }

        {
            keyCount>0 &&
            [touchState, paramState].map((item: any) => {

                const hasKeys = Object.keys(item).length > 0;

                return <ui.col width={260} fontSize="smaller" border="1px solid #ffffff22"  bgColor="#ffffff11" padding={10} margin={5}>
                    <h3>{item.handlerName}</h3>

                    {
                        hasKeys && 
                        <ui.div marginTop={10}>
                            <PropsTable object={item} />
                        </ui.div>
                        
                        
                    }
                    

                    {
                        !hasKeys && 
                        <ui.row justifyCenter alignCenter padding={15}>
                            <strong>No data yet</strong>
                        </ui.row>
                    }
                    
                    
                </ui.col>
            })
        }
    </Layout>
   
}

export default MidiControlledComponent;
