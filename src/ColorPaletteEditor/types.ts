export type MIDIColor = any;
export type MIDIColorPalette = { [index:string]: MIDIColor };


export type KeyState = {
    shiftKey: boolean,
    ctrlKey: boolean,
    altKey: boolean
}

export type ColorInputs = {
    rgba: number[],
    cmyk: number[],
    hsla: number[],
    hwba: number[],
    latest: string,
}
