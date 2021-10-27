import { MidiEventTargetConfiguration } from "../types";

export const midiColorLayoutConfig: MidiEventTargetConfiguration = {
    layout: "horizontal",

    rows: [
        [
            { type: 'selector', name: 'h', group: 'hsla' },
            { type: 'selector', name: 's', group: 'hsla' },
            { type: 'selector', name: 'l', group: 'hsla' },
            { type: 'selector', name: 'a', group: 'hsla' },

            { type: 'selector', name: 'r', group: 'rgba' },
            { type: 'selector', name: 'g', group: 'rgba' },
            { type: 'selector', name: 'b', group: 'rgba' },
            { type: 'selector', name: 'a', group: 'rgba' },
        ], 
        [
            { type: 'selector', name: 'h', group: 'hwba' },
            { type: 'selector', name: 'w', group: 'hwba' },
            { type: 'selector', name: 'b', group: 'hwba' },
            { type: 'selector', name: 'a', group: 'hwba' },

            { type: 'selector', name: 'c', group: 'cmyk' },
            { type: 'selector', name: 'm', group: 'cmyk' },
            { type: 'selector', name: 'y', group: 'cmyk' },
            { type: 'selector', name: 'k', group: 'cmyk' },
            
        ],

        [
            { type: 'pad', name: undefined, channel: 1, number: 1 },
            { type: 'pad', name: undefined, channel: 2, number: 2 },
            { type: 'pad', name: undefined, channel: 3, number: 3 },
            { type: 'pad', name: undefined, channel: 4, number: 4  },

            { type: 'pad', name: undefined, channel: 5, number: 5  },
            { type: 'pad', name: undefined, channel: 6, number: 6  },
            { type: 'pad', name: undefined, channel: 7, number: 7  },
            { type: 'pad', name: undefined, channel: 8, number: 8  },
        ], 
        [
            { type: 'pad', name: undefined, channel: 1, number: 9  },
            { type: 'pad', name: undefined, channel: 2, number: 10  },
            { type: 'pad', name: undefined, channel: 3, number: 11  },
            { type: 'pad', name: undefined, channel: 4, number: 12  },

            { type: 'pad', name: undefined, channel: 5, number: 13  },
            { type: 'pad', name: undefined, channel: 6, number: 14  },
            { type: 'pad', name: undefined, channel: 7, number: 15  },
            { type: 'pad', name: undefined, channel: 8, number: 16  },
        ], 
        
    ],

    revision: 1,
};