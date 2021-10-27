import React from 'react';
import * as ui from '@reactiff/ui-core';
import OnOffButton from './OnOffButton';
import midiContext from '../midiContext';
import clsx from 'clsx';

type PropsType = { devices: any[] };
export default (props: PropsType) => {

    // const midi = React.useContext(midiContext);

    return <ui.col solid>
        {
            (!props.devices || props.devices.length === 0) &&
            <span>No MIDI devices found</span>
        }
        {
            props.devices &&
            <>
                {
                    props.devices.map((d: any, i: number) => {
                        
                        const enabled = d.enabled;
                        const connected = d.connected;

                        return <ui.row key={d.id} alignCenter solid marginBottom={1} spaced className={clsx('midi-device', { enabled, connected })}>
                            <ui.col padding={15}>
                                <ui.row>
                                    <ui.div grow>
                                        {d.name}
                                    </ui.div>
                                    {/* <DeviceSettings device={d} /> */}
                                </ui.row>
                                <ui.div>
                                    <OnOffButton element={on => on ? 'ON' : 'OFF'} defaultValue onChange={en => d.enable(en)} />
                                </ui.div>
                            </ui.col>
                            
                            
                        </ui.row>
                    })
                }
            </>
        }
    </ui.col>
}