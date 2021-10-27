import { MidiControl } from "../types";

function fstr(value: any, o?: any) {
    if (value === null || value === undefined) {
        if (o && o.format) return o.format(value);
        return '';
    }
    if (o && o.format) return o.format(value);
    return value;
}

export function getControlId(ctl: MidiControl) {
    if (!ctl) throw new Error();
    return [
        fstr(ctl.type),
        fstr(ctl.group),
        fstr(ctl.name),
        fstr(ctl.channel, { format: (x) => !!x ? 'ch' + x : ''}),
        fstr(ctl.number),
    ].filter(t => !!t).join('-');
}

