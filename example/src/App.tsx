import React from 'react'
import * as midi from '@reactiff/midi'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import './css/index.css'
import './css/orthogonal.css'
import './css/flex.css'
import * as ui from './ui'
import { ThemeProvider } from './Theme'
import { MIDIColorPalette } from '../../dist/ColorPaletteEditor/types'

const App = () => {

  const [palette, setPalette] = React.useState<MIDIColorPalette>({
    primaryColor: 'royalblue',
    secondaryColor: 'pink',
    danger: 'red',
    background: '#eee',
    text: '#333'
  })

  return (
    <ThemeProvider>
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
            <midi.MidiProvider>
              <Switch>
                <Route path='/'>
                  <midi.MidiColorPaletteEditor
                    palette={palette}
                    onChange={setPalette}
                    preview={<DesignPreview palette={palette} />}
                  />
                </Route>
              </Switch>
            </midi.MidiProvider>
          </ui.col>
        </ui.row>
      </Router>
    </ThemeProvider>
  )
}

export default App


const DesignPreview = (props: any) => {
  const { palette } = props;
  return (
      <ui.col>
          <ui.div>Header</ui.div>
          <ui.div>
              <p>
                  Wah wah wah
              </p>
          </ui.div>
          <ui.div>
              <button>Primary</button>
              <button>Secondary</button>
          </ui.div>
      </ui.col>
  )
}
