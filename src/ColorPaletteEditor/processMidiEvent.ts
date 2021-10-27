import { MidiEvent } from '../types';
import * as ui from '@reactiff/ui-core';
import { MIDIColorManagerState } from './midiManager';
import { ColorInputs, MIDIColor } from './types';
import W3Color from './w3color';

export const processMidiEvent = (e: MidiEvent, _state: MIDIColorManagerState) => {
    
    const getMParam = (paramArray: any[]|undefined, pIndex: number, defaultValue?: any) => {
        if (!paramArray) return defaultValue;
        if (pIndex >= paramArray.length) return defaultValue;
        return paramArray[pIndex];
    }

    const createColor = () => {
        const m = getModelSpec(e);
        if (!m) return;

        const ns = _state.model[m.name];
        const pIndex = m.name.indexOf(e.name);
        
        if (pIndex >= m.factor.length) return undefined;

        const v     = ns[pIndex];
        const keyModifier = getKeyModifier(_state.keyState);
        const d     = e.change * m.factor[pIndex] * keyModifier.factor;
        const ndp   = getMParam(m.decimalPlaces, pIndex);
        const v1    = roundTo(v + d, ndp + keyModifier.requiredDecimalPlaces);
        const min   = getMParam(m.min, pIndex);
        const max   = getMParam(m.max, pIndex);
        const mod   = getMParam(m.mod, pIndex);
        ns[pIndex]  = clamp(modulate(v1, mod), min, max);

        _state.model.latest = m.name;

        const inputString = getColorString(_state.model);
        const color = getColor(_state.model, inputString);
        updateModel(_state.model, color);

        return color;
    };

    const newColor = createColor();

    _state.updateColor(newColor);
};

function getModelSpec(e: any) {
    switch(e.group) {
        case 'rgba': return ({ name: 'rgba', factor: [1, 1, 1, 0.01], min: [0, 0, 0, 0], max: [255, 255, 255, 1], decimalPlaces: [0, 0, 0, 2] });
        case 'cmyk': return ({ name: 'cmyk', factor: [0.01, 0.01, 0.01, 0.01], min: [0, 0, 0, 0], max: [1, 1, 1, 1], decimalPlaces: [2, 2, 2, 2] });
        case 'hsla': return ({ name: 'hsl', factor: [1, 0.01, 0.01], min: [undefined, 0, 0], max: [undefined, 1, 1], mod: [360], decimalPlaces: [0, 2, 2] });
        case 'hwba': return ({ name: 'hwb', factor: [1, 0.01, 0.01], min: [undefined, 0, 0], max: [undefined, 1, 1], mod: [360], decimalPlaces: [0, 2, 2] });
        default: return null;
    }
 }

 const getKeyModifier = (keyState: any) => {
    // Alt key makes change smaller
    if (keyState.altKey && keyState.ctrlKey) return { factor: 0.001, requiredDecimalPlaces: 3 };
    if (keyState.altKey && keyState.shiftKey) return { factor: 0.01, requiredDecimalPlaces: 2 };
    if (keyState.altKey) return { factor: 0.1, requiredDecimalPlaces: 1 };
    // without alt key, change is bigger
    if (keyState.ctrlKey && keyState.shiftKey) return { factor: 1000, requiredDecimalPlaces: 0 };
    if (keyState.ctrlKey) return { factor: 100, requiredDecimalPlaces: 0 };
    if (keyState.shiftKey) return { factor: 10, requiredDecimalPlaces: 0 };
    return { factor: 1, requiredDecimalPlaces: 0 };
}

const updateModel = (model: any, color: MIDIColor) => {
    const keys = Object.keys(model).filter(k => k !== model.latest && k !== 'latest');
    keys.forEach(key => {
        switch(key) {
            case 'rgba': return updateRgbaModel(model, color.toRgb());
            case 'cmyk': return updateCmykModel(model, color.toCmyk());
            case 'hsla': return updateHslModel(model, color.toHsl());
            case 'hwba': return updateHwbModel(model, color.toHwb());
        }
    });
}

function roundTo(value: number, decimalPlaces?: number) {
    if (isNullOrUndefined(decimalPlaces)) return value;
    const nn = Math.pow(10, decimalPlaces!);
    return Math.round((value + Number.EPSILON) * nn) / nn;
}


function isNullOrUndefined(value: any) {
    return value === undefined || value === null;
}

function modulate(value: number, mod?: number) {
    if (!mod) return value;
    return value % mod;
}

function clamp(value: number, min?: number, max?: number) {
    const minVal = isNullOrUndefined(min) ? Number.NEGATIVE_INFINITY : min!;
    const maxVal = isNullOrUndefined(max) ? Number.POSITIVE_INFINITY : max!;
    const mx = Math.max(minVal, value);
    const mn = Math.min(maxVal, mx);
    return mn;
}

const pct = (value: number) => {
    return `${roundTo(value * 100, 2)}%`;
}

const int = (value: number) => {
    return `${Math.round(value)}`;
}

const getColorString = (state: ColorInputs) => {
    const ns = state[state.latest];
    if (!ns) return '';
    switch(state.latest) {
        case 'hwba': return `hwb(${int(ns[0])}, ${pct(ns[1])}, ${pct(ns[2])})`;
        case 'hsla': return `hsl(${int(ns[0])}, ${pct(ns[1])}, ${pct(ns[2])})`;
        case 'cmyk': return `cmyk(${pct(ns[0])}, ${pct(ns[1])}, ${pct(ns[2])}, ${pct(ns[3])})`;
        default: return `rgba(${int(ns[0])}, ${int(ns[1])}, ${int(ns[2])}, ${ns[3]})`;
    }
};

const getColor = (state: ColorInputs, inputString: string) => {
    const colorFromString = new W3Color(inputString);
    if (state.latest === 'rgba' || state.rgba[3] === 1) return colorFromString;
    const colorWithAlpha = colorFromString.toRgb();
    colorWithAlpha.a = state.rgba[3];
    return new W3Color(colorWithAlpha);
};

const updateRgbaModel = (state: ColorInputs, color: any) => {
    state.rgba[0] = color.r;
    state.rgba[1] = color.g;
    state.rgba[2] = color.b;
    state.rgba[3] = color.a;
}
const updateCmykModel = (state: ColorInputs, color: any) => {
    state.cmyk[0] = color.c;
    state.cmyk[1] = color.m;
    state.cmyk[2] = color.y;
    state.cmyk[3] = color.k;
}
const updateHslModel = (state: ColorInputs, color: any) => {
    state.hsla[0] = color.h;
    state.hsla[1] = color.s;
    state.hsla[2] = color.l;
}
const updateHwbModel = (state: ColorInputs, color: any) => {
    state.hwba[0] = color.h;
    state.hwba[1] = color.w;
    state.hwba[2] = color.b;
}
