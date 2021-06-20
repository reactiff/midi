import React, { useContext, useEffect, useState } from 'react'
import { midiContext, MidiIndicator } from '@reactiff/midi';
import { MidiEventTarget } from '../../dist/initialize/processMidiMessage';
import ui from '@reactiff/ui-core';

function parseProperties(object: any) {
    const properties = Object.entries(object).map(([key, value]) => {
        const tokens: number[] = Object.values(value as any).map(v => v as number).slice(1);
        const formatted = tokens.map((t, i) => {
            switch(i) {
                case 2:
                    return t.toFixed(2);
                default:
                    return t;
            }
        });
        const str = formatted.map(
            (v: any, i: number) => {
                const padded = v.toString().padStart(3, ' ')
                return padded;
            }
        ).join(' ');
        return { 
            key, 
            value: str,
        }
    });
    return properties;
}

const PropsTable = (props: any) => {
    const properties = Object.entries(props.object).map(([key, value]) => ({key, value} as any));
    return <>
        {
            properties.map((p, i) => {
                return <ui.row key={i}>
                    <ui.div width="50%">{p.key}</ui.div>
                    <ui.div width="50%">{p.value}</ui.div>
                </ui.row>
            })
        }
    </>
}

export default PropsTable;