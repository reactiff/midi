import { v4 as uuid } from 'uuid';
import { processMidiMessage } from './processMidiMessage';
import _ from 'lodash';
import { MidiControl, MidiEventTarget, MidiMappedControl } from '../types';
import { getControlId } from '../Settings/getControlId';

function createMap() {
  return { fromMidi: {}, fromControl: {} };
}

// SAVING & LOADING
function getStorageKey(controller: DeviceController, eventTarget: MidiEventTarget) {
  const layout = eventTarget.config.layout || 'horizontal';
  return `${controller.deviceId}-${layout}-${eventTarget.id}`;
}
function loadMappings(controller: DeviceController, eventTarget?: MidiEventTarget) {
  if (!eventTarget) return createMap();
  const key =  getStorageKey(controller, eventTarget);
  const blob = localStorage.getItem(key);
  if (!blob) return createMap();
  const object = JSON.parse(blob);
  const rev = object.revision || 0;
  const rev1 = eventTarget.config.revision || 0;
  if (rev1 > rev) return createMap();
  return object;
}
function saveMappings(controller: DeviceController, eventTarget: MidiEventTarget) {
  const key = getStorageKey(controller, eventTarget);
  const rev1 = eventTarget.config.revision || 0;
  if (rev1) {
    controller.midiMap.revision = rev1;
  }
  localStorage.setItem(key, JSON.stringify(controller.midiMap));
}

export default class DeviceController {
  id: string;
  deviceId: string;
  device: any;
  midiContext: any;
  enabled: boolean = true;
  connected: boolean = false;
  sustained: any = {};
  initialized: boolean = false;
  //
  eventTarget?: MidiEventTarget;
  activeMapping?: MidiMappedControl;
  midiMap: any = createMap();
  
  constructor(device: any, midiContext: any) {
    // TODO DEVICE ID IS ONLY IMPORTANT WHEN THERE ARE TWO OR MORE DEVICES WITH SAME NAME
    // THIS NEEDS TO BE TESTED AND SOLVED

    const name = device.name.toLowerCase().replace(/\s/g, '-');
    this.deviceId = `${name}`; //-${device.id}`;  
    this.midiContext = midiContext;
    this.id = uuid();
    device.controllerId  = this.id;
    device.onmidimessage = this.onMIDIMessage.bind(this); 
    this.device = device;
    this.connected = device.state === 'connected';
  }
  
  // MAPPING
  bindEventTarget(eventTarget?: MidiEventTarget) {
    this.eventTarget = eventTarget;
    this.midiMap = loadMappings(this, eventTarget);
  }

  beginMapping(mappedControl: MidiMappedControl) {
    const rerender = this.activeMapping ? this.activeMapping.rerender : () => {};
    this.activeMapping = mappedControl;
    this.activeMapping.rerender();
    rerender();
  }

  cancelMapping() {
    const rerender = this.activeMapping ? this.activeMapping.rerender : () => {};
    this.activeMapping = undefined;
    rerender();
  }

  finalizeMapping(message: number[]) {
    
    const am = this.activeMapping!;

    const channel = am.control.channel;
    const number = am.control.number;

    const { group, type, name } = am.control;

    const [ command, note ] = message;

    // 1st mapping: command-note -> channel-type-name
    this.midiMap.fromMidi[`${command}-${note}`] = { type, name, number, channel, group };

    // 2st mapping: channel-type-name -> command-note
    const controlId = getControlId(am.control);
    this.midiMap.fromControl[controlId] = { command, note };

    saveMappings(this, this.eventTarget!);
    
    const rerender = this.activeMapping ? this.activeMapping.rerender : () => {};
    this.activeMapping = undefined;
    rerender();

  }

  getMappedEventData(controlId?: string) {
    if (!controlId) return;
    return this.midiMap.fromControl[controlId];
  }

  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////
  
  disconnect() {
    delete this.device.onmidimessage;
    this.connected = false;
  }
  
  onMIDIMessage(message: any) {
    
    if (!this.eventTarget) return;
    if (!this.enabled) return;
    if (this.activeMapping) return this.finalizeMapping(message.data);
    processMidiMessage(this, message);
  }

  enable(state: boolean) {
    this.midiContext.setControllers(items => 
      items.map(d => {
          if (d.id === this.id) {
              d.enabled = state;
          }
          return d;
      })
    );
  }
}
