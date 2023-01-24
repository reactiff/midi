import Color from 'color';

export type Chroma24 = (color: ColorParam) => ExtendedColor;
const chroma24: Chroma24 = (color: ColorParam) => {
  return new ExtendedColor(parseColor(color));
}
export default chroma24;

export type RgbArray = number[];
export type RgbObject = { r: number, g: number, b: number };
export type ColorParam = string|RgbObject|RgbArray|any;
export type ColorStyle = ExtendedStyle; 
export type ColorSchemeName = 'tetradicSquare'|'tetradicRect';
export type ColorPalette = Record<string, ExtendedColor>;
export type SchemeOptions = { angularOffsets?: number[]};

export type ColorMap = { 
  background: ExtendedColor,
  foreground: ExtendedColor,
  default: ExtendedColor,
  primary?: ExtendedColor,
  secondary?: ExtendedColor,
  success: ExtendedColor,
  alert: ExtendedColor,
  danger: ExtendedColor,
};

export type ColorOnColor = {
  background: ExtendedColor,
  foreground: ExtendedColor,
  style: any,
};

export type ColorContrast = {
  ratio: number,
  background: ExtendedColor,
  foreground: ExtendedColor,
  style: any,
  lightOnDark: ColorOnColor,
  darkOnLight: ColorOnColor,
  darkest: ExtendedColor,
  lightest: ExtendedColor,
  toArray: () => ExtendedColor[],
};

export const schemes = {
  tetradic(colors: any, options?: SchemeOptions) {
    const offsets = (options || {}).angularOffsets || [0, 0, 0, 0];
    const theta = makeOffsetAngle(offsets);
    const primary = colors.primary;
    const scheme = {
      ...colors,
      secondary: primary.rotate(theta(1, -90)),
      alert: primary.rotate(theta(2, -180)),
      danger: primary.rotate(theta(3, -270)),
    };
    return Object.keys(scheme).reduce((acc: any, key) => {
      acc[key] = scheme[key].setName(key);
      return acc;
    }, {});
  },
  tetradicSquare(colors: any) {
    return schemes.tetradic(colors);
  },
  tetradicRect(colors: any) {
    return schemes.tetradic(colors, { angularOffsets: [0, 15, 0, 15] });
  }  
}

export function createScheme(scheme: ColorSchemeName, colors: any) {
  return schemes[scheme](colors);
}

export class ExtendedColor {
  name?: string;
  color: any;
  rgb: RgbObject;

  constructor(color: any, options?: any) {
    this.name = undefined;    
    this.color = color;
    this.rgb = color.unitObject();
    Object.assign(this, {[Symbol.for('type')]: 'ExtendedColor'});
    Object.assign(this, options);
  }
  
  setName(name: string) {
    this.name = name;
    return this;
  }

  get r() { return this.rgb.r }
  get g() { return this.rgb.g }
  get b() { return this.rgb.b }
  get a() { return this.color.valpha }
 
  moveTo(color: any, amount: number, absolute?: boolean, full?: boolean) {
    const monochromeStart = this.color.grayscale().unitArray();
    const meanProximity = Math.abs(monochromeStart[0] - 0.5);
    // to compensate for the loss of relative step amount from initial position towards the mean,
    // the adjustment factor is inversely proportional to the loss factor, i.e. the reciprocal of
    // initial color proximity to the mean
    let absAdjustment = 1; // default should be 1 so it can be used in all calculations without affecting them
    if (absolute) {
        // each color channel should be adjusted using the same factor, so that there is no color shift
        // so we need the get gray scale value of the color, so that we reduce its representation to a single number
        absAdjustment = (0.5 - meanProximity) / 0.5;
    }
    const limit = full ? 1 : 0;
    const result = Object.keys(this.rgb).reduce((acc: any, key) => { 
        let src = (this.rgb as any)[key];
        if (key === 'alpha') {
            src = typeof src === 'undefined' ? 1 : src;
        }
        const delta = meanProximity * amount;
        const adjustedDelta = delta * absAdjustment;
        const effectiveDelta = meanProximity > 0 ? Math.max(delta, adjustedDelta, limit) : Math.min(delta, adjustedDelta, -limit);
        const sigmoid = src + Math.max(delta, effectiveDelta);
        const clipped = Math.min(1, Math.max(0, sigmoid));
        acc[key] = key === 'alpha' ? clipped : clipped * 255;
        return acc;
    }, {});
    return new ExtendedColor(Color.rgb(result));
  }

  isDark() {
    return this.color.isDark();
  }

  push(amount?: number) { 
    const param = typeof amount === 'undefined' ? 1 : amount;
    if (this.isDark()) {
      return this.darken(param);
    }
    return this.lighten(param);
  }
  
  pull(amount?: number) { 
    const param = typeof amount === 'undefined' ? 1 : amount;
    if (this.isDark()) {
      return this.lighten(param);
    }
    return this.darken(param);
  }

  /**
   * Channelwise add color, where channel values are between 0 and 255.
   * 
   * @param vector - { r: 128, g: 128, b: 128 }
   */
  add(color: ColorParam, amount?: number) {
    const _amount = amount !== undefined ? amount : 1;
    const vector = parseColor(color);
    const R = Math.round(this.r * 255) + (vector.color[0] || 0) * _amount;
    const G = Math.round(this.g * 255) + (vector.color[1] || 0) * _amount;
    const B = Math.round(this.b * 255) + (vector.color[2] || 0) * _amount;
    const rgb = { 
      r: Math.min(255, R),
      g: Math.min(255, G),
      b: Math.min(255, B),
    };
    const target = Color.rgb(rgb);
    return new ExtendedColor(target)
  }

  /**
   * Channelwise subtract color, where channel values are between 0 and 255.
   * 
   * @param vector - { r: 128, g: 128, b: 128 }
   */
   subtract(color: ColorParam, amount?: number) {
    const _amount = amount !== undefined ? amount : 1;
    const vector = parseColor(color);
    const R = Math.round(this.r * 255) - (vector.color[0] || 0) * _amount;
    const G = Math.round(this.g * 255) - (vector.color[1] || 0) * _amount;
    const B = Math.round(this.b * 255) - (vector.color[2] || 0) * _amount;
    const rgb = { 
      r: Math.max(0, R),
      g: Math.max(0, G),
      b: Math.max(0, B),
    };
    const target = Color.rgb(rgb);
    return new ExtendedColor(target)
  }

  static luminance(rgb: RgbObject|ExtendedColor): number {
    const rg = rgb.r <= 0.03928 ? rgb.r / 12.92 : ((rgb.r + 0.055) / 1.055) ** 2.4;
    const gg = rgb.g <= 0.03928 ? rgb.g / 12.92 : ((rgb.g + 0.055) / 1.055) ** 2.4;
    const bg = rgb.b <= 0.03928 ? rgb.b / 12.92 : ((rgb.b + 0.055) / 1.055) ** 2.4;
    return 0.2126 * rg + 0.7152 * gg + 0.0722 * bg;
  }

  luminance() {
      return ExtendedColor.luminance(this);
  }

  static lightest(color1: RgbObject|ExtendedColor, color2: RgbObject|ExtendedColor) {
    return new ExtendedColor(
      parseColor(
        ExtendedColor.luminance(color1) >= ExtendedColor.luminance(color2) 
        ? color1 
        : color2
      )
    ); 
  }

  lightest(other: ExtendedColor) {
    return ExtendedColor.lightest(this, other);
  }

  static darkest(color1: RgbObject|ExtendedColor, color2: RgbObject|ExtendedColor) {
    return new ExtendedColor(
      parseColor(
        ExtendedColor.luminance(color1) <= ExtendedColor.luminance(color2) 
        ? color1 
        : color2
      )
    ); 
  }

  darkest(other: ExtendedColor) {
    return ExtendedColor.darkest(this, other);
  }


  static contrastRatio(color1: RgbObject|ExtendedColor, color2: RgbObject|ExtendedColor): number {
    const l1 = ExtendedColor.luminance(color1);
    const l2 = ExtendedColor.luminance(color2);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    const ratio = (lightest + 0.05) / (darkest + 0.05);
    return ratio;
  }

  contrastRatio(counterpart: ExtendedColor): number {
    return ExtendedColor.contrastRatio(this, counterpart);
  }

  hex(important?: boolean) {
    if (this.color.valpha === 0) {
      return `transparent${important?'!important':''}`;
    }
    const alpha = this.color.valpha < 1 ? Math.round(this.color.valpha * 255).toString(16) : '';
    return `${this.color.hex()}${alpha}${important?'!important':''}`;
  }

  rgbString() {
    const r = Math.round(this.r * 255);
    const g = Math.round(this.g * 255);
    const b = Math.round(this.b * 255);
    const a = this.a;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  contrast(targetRatio: number, contrastBase?: ColorParam) {
    if (targetRatio > 21) throw new Error('Maximum contrast ratio is 21');
    const foreground = contrastBase ? chroma24(contrastBase) : chroma24(this.hex());
    const contrast: ColorContrast = {
      // base: this,
      ratio: targetRatio,
      background: this,
      foreground: foreground,
      style: {},
      darkest: this,
      lightest: foreground,
      lightOnDark: {
        background: this,
        foreground: foreground,
        style: {},
      },
      darkOnLight: {
        background: foreground,
        foreground: this,
        style: {},
      },
      toArray: () => [],
    };

    let amount = 0;
    const step = 0.01;
    let bestRatio;
    
    const adjustBackgroundColorForTargetRatio = (adjustmentStep: number) => {
      const rgb = {...contrast.background.rgb};
      do {
        adjustRGB(rgb, adjustmentStep);
        bestRatio = ExtendedColor.contrastRatio(rgb, contrast.foreground);
      } while (bestRatio < targetRatio);
      return new ExtendedColor(
        Color.rgb({
          r: Math.round(rgb.r * 255),
          g: Math.round(rgb.g * 255),
          b: Math.round(rgb.b * 255),
        })
      );
    }

    do {
      amount += step;
      contrast.foreground = this.pull(amount);
      bestRatio = contrast.background.contrastRatio(contrast.foreground);
      const l = contrast.foreground.luminance();
      if ((l === 0 || l === 1) && bestRatio < targetRatio) {
        if (l === 1) {
          contrast.background = adjustBackgroundColorForTargetRatio(-0.01);
          break;
        }
        contrast.background = adjustBackgroundColorForTargetRatio(0.01);
        break;
      }
    } while (bestRatio < targetRatio)

    contrast.darkest = ExtendedColor.darkest(contrast.background, contrast.foreground);
    contrast.lightest = ExtendedColor.lightest(contrast.background, contrast.foreground);
    contrast.lightOnDark.background = contrast.darkest;
    contrast.lightOnDark.foreground = contrast.lightest;
    contrast.darkOnLight.background = contrast.lightest;
    contrast.darkOnLight.foreground = contrast.darkest;
    contrast.lightOnDark.style = ExtendedStyle.create({
      backgroundColor: contrast.lightOnDark.background.hex() + '!important',
      color: contrast.lightOnDark.foreground.hex() + '!important',
    }) as any;
    contrast.darkOnLight.style = ExtendedStyle.create({
      backgroundColor: contrast.darkOnLight.background.hex() + '!important',
      color: contrast.darkOnLight.foreground.hex() + '!important',
    }) as any;
    contrast.style = ExtendedStyle.create({
      backgroundColor: contrast.background.hex() + '!important',
      color: contrast.foreground.hex() + '!important',
    }) as any;
    contrast.toArray = () => [
      contrast.darkest,
      contrast.lightest
    ];
    return contrast;
  }

  invert() {
    return new ExtendedColor(this.color.negate());
  }

  lighten(amount: number) {
    return new ExtendedColor(this.color.lighten(amount));
  }

  darken(amount: number) {
    return new ExtendedColor(this.color.darken(amount));
  }

  saturate(amount: number = 1) {
    return new ExtendedColor(this.color.saturate(amount));
  }

  desaturate(amount: number = 1) {
    return new ExtendedColor(this.color.desaturate(amount));
  }

  grayscale() {
    return new ExtendedColor(this.color.grayscale());
  }
  
  lightness(amount: number) {
    return new ExtendedColor(this.color.lightness(amount));
  }

  opacity(amount: number) {
    if (amount < 0) throw new Error('Opacity must be between 0 and 1');
    if (amount > 1) throw new Error('Opacity must be between 0 and 1');
    return new ExtendedColor(this.color.alpha(amount));
  }
  
  rotate(degrees: number) {
    if (!degrees) return this;
    return new ExtendedColor(this.color.rotate(degrees));
  }

  backgroundStyle(style?: any) {
    return ExtendedStyle.create({
      backgroundColor: this.hex() + '!important',
      ...style,
    });
  }

  colorStyle(style?: any) {
    return ExtendedStyle.create({
      color: this.hex() + '!important',
      ...style,
    });
  }

}

export class ExtendedStyle {
  constructor(style?: any) {
    const instance: any = this;
    if (style) {
      Object.keys(style).forEach(key => {
        const tokens = [style[key]];
        if (typeof tokens[0] !== 'object') {
          let isAlreadyImportant = false;
          if (typeof tokens[0] === 'string' && tokens[0].indexOf('!important') > 0) {
            isAlreadyImportant = true;
          }
          if (!isAlreadyImportant) {
            tokens.push('!important');
          }
          instance[key] = tokens.join('');
        }
      })
    }
  }
  static create(style: any) {
    return new ExtendedStyle(style) as any;
  }
  important(...specificKeys: string[]) {
    const keys = Object.keys(this);
    const cnt = specificKeys.length;
    const excludedKeys = 'ratio'.split(',');
    const importantStyle = keys.reduce((style: any, key) => {
      if (!excludedKeys.includes(key)) {
        if (cnt === 0 || (cnt > 0 && specificKeys.includes(key))) {
          const value = (this as any)[key];
          if (typeof value !== 'object') {
            let isAlreadyImportant = false;
            if (value.indexOf && !!value && value.indexOf('!important') > 0) {
              isAlreadyImportant = true;
            }
            if (!isAlreadyImportant) {
              return Object.assign(style, { [key]: (this as any)[key] + '!important' });
            }
          }
        }
      }
      return style;
    }, {});
    return new ExtendedStyle(importantStyle)
  }
}

function makeOffsetAngle(offsets: number[])  {
  return (i: number, base: number) => base + offsets[i]
}

function parseColor(color: ColorParam) {
  if ( ! color) return Color("#000000");
  if (typeof color === 'string') {
    return Color(color);
  }
  if (Array.isArray(color)) {
    return fromArray(color);
  }
  if (typeof color === 'object') {
    if (color[Symbol.for('type')] === 'ExtendedColor' && !!color.color.unitObject) {
      return color.color;
    }
    if (color[Symbol.for('type')] === 'ExtendedColor' && !color.color.unitObject && Array.isArray(color.color.color)) {
      return fromArray(color.color.color);
    }
    if (color.hex) {
      return color;
    }
    return fromObject(color);
  }
  throw new Error('Invalid param of type: ' + typeof color);
}

function fromArray(color: number[]) {
  if (color.length < 3) {
    throw new Error('Array has too few parameters.  Expected 3: [ r, g, b ]');
  }
  if (color.length > 3) {
    throw new Error('Array has too many parameters.  Expected 3: [ r, g, b ]');
  }
  return Color.rgb(color[0], color[1], color[2]);
}

function fromObject(color: RgbObject) {
  if (
    Reflect.has(color, 'r') &&
    Reflect.has(color, 'g') &&
    Reflect.has(color, 'b')
  ) {
    return Color.rgb(color.r, color.g, color.b);
  }
  throw new Error('Invalid param');
}

function adjustRGB(rgb: any, amount: number, preserveHue?: boolean) {
  rgb.r += amount;
  rgb.g += amount;
  rgb.b += amount;
  if (preserveHue) {
    const excess = amount < 0 
    ? Math.min(
      rgb.r < 0 ? rgb.r : 0,
      rgb.g < 0 ? rgb.g : 0,
      rgb.b < 0 ? rgb.b : 0,
    )
    : Math.max(
      rgb.r > 1 ? rgb.r - 1 : 0,
      rgb.g > 1 ? rgb.g - 1 : 0,
      rgb.b > 1 ? rgb.b - 1 : 0,
    );
    if (excess !== 0) {
      rgb.r -= excess;
      rgb.g -= excess;
      rgb.b -= excess;
    }
  }
}