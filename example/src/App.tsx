import React from 'react'
import MidiControlledComponent from './MidiControlledComponent'
import * as ui from '@reactiff/ui-core'
import { MidiProvider } from '@reactiff/midi'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import './css/index.css'
import './css/orthogonal.css'
import './css/flex.css'

import DetachablePaletteEditor from './DetachablePaletteEditor'

// import Css3D from './Css3D';

const App = () => {
  return (
    <Router>
      <ui.row>
        <ui.col minWidth={`140px`} padding={15}>
          <ui.div sticky top={15}>
            <nav>
              <ul>
                <li>
                  <Link to='/'>Color Design</Link>
                </li>
              </ul>
            </nav>
          </ui.div>
        </ui.col>

        <ui.col grow alignSelfStretch padding={15}>
          <MidiProvider>
            <Switch>
              <Route path='/'>
                <DetachablePaletteEditor />
              </Route>
            </Switch>
          </MidiProvider>
        </ui.col>
      </ui.row>
    </Router>
  )
}

export default App
