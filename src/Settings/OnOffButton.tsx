import React from 'react';
import * as ui from '../ui';
// import './css/onoffbutton.css';

type OnOffButtonProps = {
    id?: string,
    value?: boolean,
    defaultValue?: boolean,
    onChange: (enabled: boolean) => void,
    element: (enabled: boolean) => React.ReactNode,
}

const STORAGE_PREFIX = 'on-off-';

const OnOffButton = (props: OnOffButtonProps) => {

    const [enabled, setEnabled] = React.useState(() => {
        let initial = props.defaultValue || false;
        if (props.id)  {
            const stored = localStorage.getItem(`${STORAGE_PREFIX}-${props.id}`);
            return stored === 'true';
        }
        return initial;
    });
    
    React.useEffect(() => {
        props.onChange(enabled);
    }, [enabled, props.id]);

    // Event Handlers
    const handleToggle = React.useCallback(async (e: any) => {
        const value = !enabled;
        if (props.id) {
            localStorage.setItem(`${STORAGE_PREFIX}-${props.id}`, value.toString());
        }
        setEnabled(value);
    }, [enabled, props.id]);
    
    
    return (
        <ui.div className={`mpg-onoff ${enabled ? 'enabled' : ''}`} onClick={handleToggle}>
            { props.element(enabled) }
        </ui.div>
    )
}

export default OnOffButton;