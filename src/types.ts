import DeviceController from "./initialize/DeviceController"

export type MidiEvent = {
    handlerName: string,
    group: string,
    name: string,
    type: string,
    channel: number,
    number: number,
    command: number,
    note: number,
    velocity: number,
    frequency: number,
    change: number,
  }
  export type MidiTapEvent = MidiEvent
  export type MidiAftertouchEvent = MidiEvent
  export type MidiParameterEvent = MidiEvent
  export type MidiNoteEvent = MidiEvent
  export type MidiEventHandler<T> = (e: T) => void
  
  export type MidiControlGroup = {
    position?: number,
    controls: MidiControl[],
  }

  export type MidiControl = {
    type: 'selector' | 'pad',
    group?: string,
    name?: string,
    number?: number,
    channel?: number,
  }

  export type MidiEventTargetConfiguration = {
    revision?: number,
    layout?: 'horizontal'|'vertical'|string,
    flowDirection?: 'inverted'|'',
    globalGroups?: MidiControl[][],
    
    channels?: number,
    channelControls?: MidiControl[],

    groups?: { [index: string]: MidiControlGroup },
    rows?: MidiControl[][],

    globalControls?: MidiControl[],
  }
  
  export type MidiEventTarget = {
    id: string,
    config: MidiEventTargetConfiguration,
    onTouchStart?: MidiEventHandler<MidiTapEvent>
    onAfterTouch?: MidiEventHandler<MidiAftertouchEvent>
    onTouchEnd?: MidiEventHandler<MidiTapEvent>
    onParameterChange?: MidiEventHandler<MidiParameterEvent>
    onNoteOn?: MidiEventHandler<MidiNoteEvent>
    onNoteOff?: MidiEventHandler<MidiNoteEvent>
    onUnknownEvent?: MidiEventHandler<MidiEvent>
  }


  
export type MidiMappedEvent = { 
  command: number, 
  note: number 
};

export type MidiMappedControl = { 
  channel?: number,
  group?: string,
  control: MidiControl,
  controller: DeviceController,
  rerender: () => void,
};



export interface InternalMidiContextInterface {

  settingsOpen: boolean;
  toggleSettings: (open: boolean) => void;

  controllers: DeviceController[];
  setControllers: (controllers: DeviceController[]) => void;

  getEventTarget: () => MidiEventTarget | undefined; 

  register: (target: MidiEventTarget) => void;
  unregister: (target: MidiEventTarget) => void;

};