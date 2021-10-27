import React, { useCallback, useEffect } from 'react'
import midiContext from '../midiContext'
import * as ui from '@reactiff/ui-core'

import MIDIPad from './MIDIPad'
import MIDISelector from './MIDISelector'

import SettingsLayout from './layout/SettingsLayout'

//////////////////////////////////////////////////////////// MIDI SETTINGS

const MidiSettings = (props: any) => {

  const midi: any = React.useContext(midiContext)
   
  // CALLBACKS //
  const quitNow = useCallback(() => midi.toggleSettings(false), [])
  const onEscapeKey = useCallback((e) => e.keyCode === 27 && quitNow(), [])

  useEffect(() => { // Handle Esc key
    document.addEventListener('keydown', onEscapeKey, false)
    return () => document.removeEventListener('keydown', onEscapeKey, false)
  }, [])

  if (!midi.settingsOpen) return null
  if (midi.controllers.length === 0) return null // No controllers connected
  
  return <SettingsLayout />
}

export default MidiSettings
