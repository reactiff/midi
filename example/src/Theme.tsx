import React, { useEffect, useState } from 'react';
import chroma24, { 
    Chroma24, 
    ColorContrast, 
    ColorSchemeName, 
    createScheme, 
    ExtendedColor 
} from './chroma24';

type ColorDesignation = 'default'|'primary'|'secondary'|'success'|'failure'|'warning'|'danger'|'error';

// Palette Type Prototype
function createPalettePrototype() {
    const neutral = chroma24('#808080');
    const contrast = neutral.contrast(10, neutral.lighten(0.1));
    const primary = neutral.lighten(0.3);
    
    return {
        black: chroma24('#000000'),
        white: chroma24('#ffffff'),
        neutral,
        background: neutral.darken(0.2),
        foreground: contrast.foreground,

        accent: chroma24('yellowgreen'),

        default: neutral,
        primary: primary,
        secondary: primary,
        alert: primary,
        danger: primary,
        
        paper: neutral.lighten(0.05),
        darkPaper: neutral.darken(0.1),
        lightPaper: neutral.lighten(0.1),
    };
}

const palettePrototype = createPalettePrototype();
export type IPalette = typeof palettePrototype;
export type IStationary = {
    lowContrast: ColorContrast,
    midContrast: ColorContrast,
    highContrast: ColorContrast,
}

export type ITheme = {
    type?: string,
    palette: IPalette,
    stationary: { paper: IStationary },
    chroma24: Chroma24,
    spacing: (coef: number) => number,
    sizing: (coef: number) => number,
    getColorByDesignation: (designation: ColorDesignation) => ExtendedColor,
    font: {
        size: any,
    },
};

function createTheme(colorMode?: string) {

    const computedStyle = getComputedStyle(document.body);

    const base = {
        // colors
        background: computedStyle.getPropertyValue("--color-base-background").trim(),
        foreground: computedStyle.getPropertyValue("--color-base-foreground").trim(),
        accent: computedStyle.getPropertyValue("--color-base-accent").trim(),
        primary: computedStyle.getPropertyValue("--color-base-primary").trim(),
        secondary: computedStyle.getPropertyValue("--color-base-secondary").trim(),
        alert: computedStyle.getPropertyValue("--color-base-alert").trim(),
        danger: computedStyle.getPropertyValue("--color-base-danger").trim(),
        paper: computedStyle.getPropertyValue("--color-base-paper").trim(),
        darkPaper: computedStyle.getPropertyValue("--color-base-dark-paper").trim(),
        lightPaper: computedStyle.getPropertyValue("--color-base-light-paper").trim(),
        // spatial
        spacing: +computedStyle.getPropertyValue("--spacing-base").trim().replace(/(px|em|rem|vh|vw)/g, ''),
        sizing: +computedStyle.getPropertyValue("--sizing-base").trim().replace(/(px|em|rem|vh|vw)/g, ''),
        // typographic
        fontSize: computedStyle.getPropertyValue("--font-size").trim(),
    };

    const schemeName = computedStyle.getPropertyValue("--color-scheme").trim();

    const background    = chroma24(base.background);
    const foreground      = chroma24(base.foreground);

    const paper         = chroma24(base.paper);
       
    const primary       = chroma24(base.primary);
    const secondary       = chroma24(base.secondary);
    const alert       = chroma24(base.alert);
    const danger       = chroma24(base.danger);
    
    const accent        = chroma24(base.accent);

    const darkPaper     = chroma24(base.darkPaper || paper.darken(0.2));
    const lightPaper    = chroma24(base.lightPaper || paper.lighten(0.2));

    const palette: IPalette = createScheme(
        (schemeName || 'tetradicSquare') as ColorSchemeName,
        {
            ...palettePrototype,
            background,
            foreground,

            paper,
            darkPaper,
            lightPaper,
            
            primary,
            secondary,
            alert,
            danger,
                    
            default: primary.grayscale(),

            accent,
        }
    );

    const theme = {
        type: colorMode, //(palette.background.isDark() ? "dark" : "light"),
        palette: palette as IPalette,
        stationary: {
            paper: {
                lowContrast: paper.contrast(5),
                midContrast: paper.contrast(10),
                highContrast: paper.contrast(15),
            },
        },
        chroma24,
        spacing: (coef: number) => base.spacing * coef,
        sizing: (coef: number) => base.sizing * coef,
        getColorByDesignation: (designation: ColorDesignation) => {
            const p: any = palette;
            if (!p[designation]) throw new Error('Invalid color designation: ' + designation);
            return p[designation];
        },

        font: {
            size: base.fontSize,
        }
    };
    return theme;
}

export const ThemeContext = React.createContext<ITheme>(createTheme());

export function ThemeProvider(props: any) {
    const [theme, setTheme] = useState<ITheme>();

    const computedStyle = getComputedStyle(document.body);
    const colorMode = computedStyle.getPropertyValue("--color-mode").trim();

    useEffect(() => {
        const theme = createTheme(colorMode);
        setTheme(theme);
    }, [colorMode]);

    if ( ! theme) return null;

    return <ThemeContext.Provider value={theme}>
        {props.children}
    </ThemeContext.Provider>
}
