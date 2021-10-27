import React, { useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

const ls = globalThis.localStorage;

export interface IDetachableContext { detached: boolean, role: 'self' | 'surrogate' };
const initialValue: IDetachableContext = { detached: false, role: "self" };
export const DetachableContext = React.createContext(initialValue);

const useInline = makeStyles((theme: Theme) => createStyles({ root: (props: any) => props }) );
const lexicon: any = {
    'attached': { actionWord: 'Detach', actionDescription: 'Open in new window' },
    'detached': { actionWord: 'Reattach', actionDescription: 'Reattach window' },
};

const stateToString = (state: boolean) => state ? 'detached' : 'attached' ;

const DetachHtmlIcon = (props: { detached: boolean, size?: number }) => {
    const size = props.size || 22;
    const classes = useInline({
        transform: props.detached ? 'rotate(90deg)' : 'rotate(-90deg)', 
        width: size, 
        height: size
    });
    return <div className={`detach-html-icon ${classes.root}`}>&#8690;</div>
}

type DetachToggleButtonProps = { state: boolean, size?: number, onToggle?: (detach: boolean) => void };
export const DetachToggleButton = (props: DetachToggleButtonProps) => {
    const size = props.size || 22;
    const detached = props.state;
    const stateString = stateToString(detached);
    const classes = useInline({ position: 'absolute', bottom: -22, right: 0, "& .MuiIconButton-root": {padding: 0} });
    const handleTrigger = useCallback((detach: boolean) => {
        props.onToggle && props.onToggle(detach)
    }, []);
    return <div className={classes.root}>
        <IconButton 
            size={size!<30?'small':'medium'}
            aria-label={lexicon[stateString].actionWord}  
            title={lexicon[stateString].actionDescription}
            onClick={() => handleTrigger(!props.state)}
        >
            <DetachHtmlIcon {...{detached, size}}/>
        </IconButton>
    </div>
}

export type DetachableState = 'detached' | 'attached';

export type DetachableProps = { 
    id?: string;
    initialState?: DetachableState;
    title?: string;
    menubar?: boolean;
    location?: boolean;
    resizable?: boolean;
    scrollbars?: boolean;
    status?: boolean;
    width?: number;
    height?: number; 
    screenX?: number;
    screenY?: number;
    children: ReactNode;
    className?: string;
    hideOriginal?: boolean;
    onWindowLoad?: (w: Window) => void;
};

const Detachable = (props: DetachableProps) => {

    const {id, children, width, height, hideOriginal, initialState, ...other} = props;
    const idString = !!id ? 'detachable-' + id : null;

    // component state
    const [state, setState] = useState<DetachableState>(() => {
        const defaultValue = initialState || 'attached';
        if (!idString) return 'attached';
        const stored = ls && ls.getItem(idString!);
        return stored === 'detached' ? 'detached' : 'attached';
    });
    const saveState = (state: DetachableState) => { 
        idString && ls.setItem(idString!, state);
        setState(state);
    }; 

    // child window
    const detached = state === 'detached';
    const [windowProps, setWindowProps] = useState<any>();
    const [childWindow, setChildWindow] = useState<Window>();

    const destroyChildWindow = useCallback(() => {
        childWindow && childWindow!.close();
    }, [childWindow]);

    useEffect(() => {
        window.addEventListener('unload', destroyChildWindow);
        return () => window.removeEventListener('unload', destroyChildWindow);
    }, [destroyChildWindow])

    useEffect(() => {
        if (detached) {
            let wprops: any = null;
            if (idString) {
                const savedState = ls.getItem(idString + '.windowState');
                if (savedState) {
                    let json;
                    try { 
                        json = JSON.parse(savedState); 
                        wprops = json;
                    } catch {}
                }
            }
            setWindowProps(wprops || {
                width: width || window.screen.width / 3,
                height: height || window.screen.height / 3,
            });
            return () => {
                destroyChildWindow();
            };
        }
        return undefined;
    }, [detached, destroyChildWindow])

    const handleTrigger = useCallback((detach: boolean) => {
        const newState = detach ? 'detached' : 'attached';
        saveState(newState);
        if (newState === 'attached') {
            destroyChildWindow();
        }
    }, [state]);

    const handleWindowLoad = useCallback((window: Window) => {
        setChildWindow(window);
        if (props.onWindowLoad) {
            props.onWindowLoad(window);
        }
    }, []);

    const handleWindowUnload = useCallback(() => {
        saveState('attached');
        setWindowProps(null);
    }, []);

    const detachableStyle = useInline({
        position: 'relative',
    });
    
    const originalHidden = detached && props.hideOriginal;

    return <React.Fragment>
        {
            // Render self (the original wrapped component)
            // (will not render if originalHidden === true)

            !originalHidden && 
            <div id={props.id} className={`detachable-container ${state} ${detachableStyle.root}`}>
                <DetachableContext.Provider value={{ detached, role: "self" }}>
                    { props.children }
                </DetachableContext.Provider>
                <DetachToggleButton onToggle={handleTrigger} state={detached} />
            </div>
        }
        
        {
            // Render surrogate (detached copy)
            detached &&
            windowProps &&
            <DetachableContext.Provider value={{ detached, role: "surrogate" }}>
                <NewWindow idString={idString} {...other} {...windowProps} onUnload={handleWindowUnload} onLoad={handleWindowLoad}>
                    {props.children}
                </NewWindow>
            </DetachableContext.Provider>
        }
    </React.Fragment>
}

export default Detachable;

type NewWindowProps = {
    idString?: string,
    className?: string,
    title?: string, 
    name?: string, 
    children?: ReactNode, 
    onLoad?: (window: Window) => void, 
    onUnload?: Function, 
    top?: number,
    left?: number,
    height?: number, 
    width?: number,
    menubar?: boolean,
    location?: boolean,
    resizable?: boolean,
    scrollbars?: boolean,
    status?: boolean,
};

export const NewWindow = (props: NewWindowProps) => {

    const {idString, className, title, name, children, onLoad, onUnload, ...other} = props;
    const [remoteContainer, setRemoteContainer] = useState<HTMLDivElement|undefined>();
    const ref = useRef<{newWindow?: Window}>({}).current;

    useEffect(() => {
        const options = Object.entries(other).map(tuple => winOption(tuple)).join(', ');
        ref.newWindow = window.open('', name || '', options)!;
        
        const createPortal = () => {
            if (ref.newWindow) {
                const remoteDiv = ref.newWindow.document.createElement('div');
                ref.newWindow.document.body.appendChild(remoteDiv);
                transferStyles(ref.newWindow.document, document)
                transferScripts(ref.newWindow.document, document)
                observeStyleMutations(ref.newWindow, document);
                // observeScriptMutations(ref.newWindow, document);
                setRemoteContainer(remoteDiv);
            }
        };

        const awaitNewWindow = () => {
            if (!ref.newWindow || ref.newWindow.document.readyState !== "complete") {
                return window.requestAnimationFrame(awaitNewWindow);
            }
            ref.newWindow.addEventListener('unload', () => {
                if (idString) {
                    const wprops: any = {
                        top: Math.round(ref.newWindow?.screenY!),
                        left: Math.round(ref.newWindow?.screenX!),
                        width: Math.round(ref.newWindow?.innerWidth!),
                        height: Math.round(ref.newWindow?.innerHeight!),
                    };
                    localStorage.setItem(idString + '.windowState', JSON.stringify(wprops));
                }
                if (onUnload) {
                    onUnload();
                }
            },);
            // set properties
            if (props.title) ref.newWindow.document.title = props.title;
            createPortal();
            props.onLoad && props.onLoad(ref.newWindow);
            return undefined;
        };

        awaitNewWindow();
    }, []);
    if (!remoteContainer) return <div />;
    return ReactDOM.createPortal(children, remoteContainer);
}

// dirty work

function transferStyles(target: Document, source: Document) {
  
  const styles = Array.from(source.styleSheets);

  const elementStyles = styles.filter(css => {
    return Reflect.has(css, 'cssRules') && !css.href;
  });
  
  const linkedStyles = styles.filter(css => 
    css.href && css.href.indexOf('google') < 0
  );

  // transfer inline style elements
  const rules = elementStyles.reduce((rules: any[], el) => rules.concat(Array.from(el.cssRules)), []);
  const tcss = target.createElement('style');
  rules.forEach(r => tcss.appendChild(target.createTextNode(r.cssText)));
  target.head.appendChild(tcss);
  // transfer linked styles
  linkedStyles.forEach(linkedStyle => {
    const link: HTMLLinkElement = target.createElement('link');
    link.rel = 'stylesheet';
    link.href = linkedStyle.href!;
    target.head.appendChild(link);
  });
}
  
function transferScripts(target: Document, source: Document) {
    const scripts = Array.from(source.scripts);
    scripts.forEach((script: HTMLScriptElement) => {
        if (script.src.endsWith('main.chunk.js')) {
            const scriptTag = target.createElement('script');
            scriptTag.src = script.src;
            target.body.appendChild(scriptTag);
        }
    });
}

function winOptionValue(value: any) {
    if (typeof value !== 'boolean') return value;
    return value === true ? 'yes' : 'no';
}

function winOption(tuple: any[]) {
    const [key, value] = tuple;
    return `${key}=${winOptionValue(value)}`;
}
  
const observeStyleMutations = (newWindow: any, document: Document) => {
    const targetNode = document.head;
    const config = { childList: true };
    const callback = function(mutationsList: any[], observer: any) {
        const target = newWindow.document;
        mutationsList.forEach(mutation => {
            (mutation.addedNodes as NodeList).forEach((style: any) => {
                if (style.nodeName === 'STYLE') {
                    if (style.sheet) {
                        const rules = Array.from(style.sheet.cssRules);
                        const newStyleElement = target.createElement('style');
                        rules.forEach((rule: any) => newStyleElement.appendChild(target.createTextNode(rule.cssText)));
                        target.head.appendChild(newStyleElement);
                    }
                }
            })
        })            
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}
