import { MidiEvent } from '../types'
import DeviceController from './DeviceController'
import frequencyMap from './frequencyMap'


const event: MidiEvent = {
  command: 0,
  note: 0,
  velocity: 0,
  frequency: 0,
  
  handlerName: '',

  group: '',
  name: '',
  type: '',
  channel: 0,
  number: 0,
  change: 0
}

Object.seal(event)

export function processMidiMessage(controller: DeviceController, message: any) {
  
  event.command = message.data[0]
  event.note = message.data[1]
  event.velocity = message.data[2];
    
  const eventId = `${event.command}-${event.note}`;

  // Mapped control
  const mapping = controller.midiMap.fromMidi[eventId];
    
  if (mapping) {
    
    event.frequency = 0;
    event.change = 0;
    event.number = mapping.number;
    event.name = mapping.name;
    event.type = mapping.type;
    event.group = mapping.group;
    event.channel = mapping.channel;

    switch (mapping.type) {
      case 'selector':
        event.handlerName = 'onParameterChange';
        event.change = event.velocity - 64;
        break;
      case 'pad':
        if (event.velocity > 0) {
          if (!controller.sustained[eventId]) {
            controller.sustained[eventId] = true;
            event.handlerName = 'onTouchStart';    
          }
          else {
            event.handlerName = 'onAfterTouch';    
          }
        }
        else {
          delete controller.sustained[eventId];
          event.handlerName = 'onTouchEnd';    
        }
        
        break
    }
  }
  else {
    
    event.group = '';
    event.name = '';
    event.type = '';
    event.channel = 0;
    event.number = 0;
    event.change = 0;
    switch (event.command) {
      case 144: // noteOn
        if (event.velocity > 0) {
          event.handlerName = 'onNoteOn';
        } else {
          event.handlerName = 'onNoteOff';
        }
        event.frequency = frequencyMap[event.note];
        break
      case 128: // noteOff
        event.frequency = frequencyMap[event.note];
        event.handlerName = 'onNoteOff';
        break
  
      default:
        event.handlerName = 'onUnknownEvent';
    }
  }
  
  const fn = controller.eventTarget![event.handlerName];
  fn && fn(event);
}


