import React, { useState, useEffect, useRef, useMemo, ReactNode } from 'react'
import midiContext, { InternalMidiContextInterface, MidiMappedControl } from './midiContext'
import { initialize } from './initialize'
import DeviceController from './initialize/DeviceController'
import { MidiEventTarget } from './initialize/processMidiMessage'
import Settings from './Settings';

//////////////////////////////////////////////////////////////////////// MIDI

type MutableState = {
  targetMap: { [index: string]: MidiEventTarget }
  targetStack: MidiEventTarget[]
}

export type MidiProps = {
  children?: ReactNode
}
export default (props: MidiProps) => {

  const [controllers, setControllers]     = useState<DeviceController[]>([]);
  const [settingsOpen, setSettingsOpen]   = useState(false);
  
  const mutable = useRef<MutableState>({
    targetMap: {},
    targetStack: []
  }).current


  // Should be called each time a) new device loads b) target registers/unregisters
  const bindEventTargets = (cc: DeviceController[], tgt?: MidiEventTarget) => {
    const _t = tgt || context.getEventTarget();
    cc.forEach(c => c.bindEventTarget(_t));
  } 


  const context: InternalMidiContextInterface = {

    settingsOpen,
    toggleSettings: (open: boolean) => {
      setSettingsOpen(open);
    },

    controllers,
    setControllers: (ctrls) => {
      bindEventTargets(ctrls);
      setControllers(ctrls);
    },

    getEventTarget() {
      if (!mutable.targetStack.length) return undefined
      return mutable.targetStack[mutable.targetStack.length - 1]
    },

    // PUBLIC INTERFACE
    register(target: MidiEventTarget) {
      if (mutable.targetMap[target.id]) {
        throw new Error('Target already registered')
      }
      mutable.targetStack.push(target)
      mutable.targetMap[target.id] = target
      bindEventTargets(controllers, target);
      return () => {
        context.unregister(target);
      };
    },

    unregister(target: MidiEventTarget) {
      const top = context.getEventTarget()
      if (!top) throw new Error('Nothing to pop')
      if (top.id !== target.id) {
        throw new Error('Target is not on top of the stack')
      }
      mutable.targetStack.pop()
      delete mutable.targetMap[target.id]
      bindEventTargets(controllers);
    },

  };

  useEffect(() => {
    initialize(context)
    return () => {
      controllers.forEach((d: any) => d.disconnect())
    }
  }, [])

  return (
    <midiContext.Provider value={context}>
      {props.children}
      <Settings />
    </midiContext.Provider>
  )
}
