import React from 'react'
import * as ui from '@reactiff/ui-core';

/////////////////////////////////////////////////////////////////////// EXAMPLE - LAYOUT

const Layout = (props: any) => {

    return <ui.col>

        <ui.div>
            <h1>@reactiff/midi</h1>
            <br/>
            <a href="https://www.npmjs.com/package/@reactiff/midi"><img src="https://img.shields.io/npm/v/@reactiff/midi.svg" alt="NPM"/></a>
            <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"/></a>
            <br/>
            <small>
                MIT © <a href="https://github.com/reactiff">Rick Ellis</a>
            </small>
            <p>
                React library for interfacing with MIDI controllers
            </p>

            <h2>Install</h2>

            <ui.row>
                <pre className="code">yarn add @reactiff/midi</pre>
            </ui.row>


            <br />  

        </ui.div>

        

        <ui.div grow alignCenter justifyCenter>
            {props.children}
        </ui.div>

    </ui.col>
}

export default Layout;
