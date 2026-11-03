/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(27, 96%, 97%)',
            '100': 'hsl(27, 96%, 94%)',
            '200': 'hsl(27, 96%, 86%)',
            '300': 'hsl(27, 96%, 76%)',
            '400': 'hsl(27, 96%, 64%)',
            '500': 'hsl(27, 96%, 50%)',
            '600': 'hsl(27, 96%, 40%)',
            '700': 'hsl(27, 96%, 32%)',
            '800': 'hsl(27, 96%, 24%)',
            '900': 'hsl(27, 96%, 16%)',
            '950': 'hsl(27, 96%, 10%)',
            DEFAULT: '#fb923c'
        },
        secondary: {
            '50': 'hsl(29, 100%, 97%)',
            '100': 'hsl(29, 100%, 94%)',
            '200': 'hsl(29, 100%, 86%)',
            '300': 'hsl(29, 100%, 76%)',
            '400': 'hsl(29, 100%, 64%)',
            '500': 'hsl(29, 100%, 50%)',
            '600': 'hsl(29, 100%, 40%)',
            '700': 'hsl(29, 100%, 32%)',
            '800': 'hsl(29, 100%, 24%)',
            '900': 'hsl(29, 100%, 16%)',
            '950': 'hsl(29, 100%, 10%)',
            DEFAULT: '#ff7c00'
        },
        accent: {
            '50': 'hsl(359, 95%, 97%)',
            '100': 'hsl(359, 95%, 94%)',
            '200': 'hsl(359, 95%, 86%)',
            '300': 'hsl(359, 95%, 76%)',
            '400': 'hsl(359, 95%, 64%)',
            '500': 'hsl(359, 95%, 50%)',
            '600': 'hsl(359, 95%, 40%)',
            '700': 'hsl(359, 95%, 32%)',
            '800': 'hsl(359, 95%, 24%)',
            '900': 'hsl(359, 95%, 16%)',
            '950': 'hsl(359, 95%, 10%)',
            DEFAULT: '#f5060a'
        },
        'neutral-50': '#ffffff',
        'neutral-100': '#000000',
        'neutral-200': '#71717a',
        'neutral-300': '#d4d4d8',
        'neutral-400': '#515b6d',
        'neutral-500': '#52525b',
        'neutral-600': '#a1a1aa',
        'neutral-700': '#9ca3af',
        'neutral-800': '#3f3f46',
        'neutral-900': '#09090b',
        background: '#09090b',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Space Grotesk',
            'sans-serif'
        ],
        font1: [
            'Inter',
            'sans-serif'
        ],
        font2: [
            'Arial',
            'sans-serif'
        ],
        font3: [
            'Times New Roman',
            'sans-serif'
        ],
        mono: [
            'Geist Mono',
            'sans-serif'
        ]
    },
    fontSize: {
        '30': [
            '30px',
            {
                lineHeight: '36px',
                letterSpacing: '-0.75px'
            }
        ],
        '36': [
            '36px',
            {
                lineHeight: '40px',
                letterSpacing: '-0.9px'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '48px',
                letterSpacing: '-1.2px'
            }
        ],
        '60': [
            '60px',
            {
                lineHeight: '60px',
                letterSpacing: '-1.5px'
            }
        ],
        '64': [
            '64px',
            {
                lineHeight: '70.4px',
                letterSpacing: '-0.4px'
            }
        ],
        '72': [
            '72px',
            {
                lineHeight: '72px'
            }
        ],
        '96': [
            '96px',
            {
                lineHeight: '144px',
                letterSpacing: '-2px'
            }
        ],
        '340': [
            '340px',
            {
                lineHeight: '340px'
            }
        ],
        '281.6': [
            '281.6px',
            {
                lineHeight: '281.6px'
            }
        ],
        '140.8': [
            '140.8px',
            {
                lineHeight: '140.8px',
                letterSpacing: '-3.52px'
            }
        ],
        '102.4': [
            '102.4px',
            {
                lineHeight: '102.4px',
                letterSpacing: '-2.048px'
            }
        ],
        '76.8': [
            '76.8px',
            {
                lineHeight: '72.96px',
                letterSpacing: '-1.92px'
            }
        ],
        '57.6': [
            '57.6px',
            {
                lineHeight: '57.6px',
                letterSpacing: '-1.44px'
            }
        ],
        '35.2': [
            '35.2px',
            {
                lineHeight: '35.2px',
                letterSpacing: '-0.88px'
            }
        ],
        '33.6': [
            '33.6px',
            {
                lineHeight: '50.4px',
                letterSpacing: '-0.84px'
            }
        ]
    },
    spacing: {
        '28': '56px',
        '32': '64px',
        '40': '80px',
        '48': '96px',
        '52': '104px',
        '56': '112px',
        '80': '160px',
        '84': '168px',
        '116': '232px',
        '185': '370px',
        '1px': '1px',
        '71px': '71px',
        '121px': '121px',
        '265px': '265px'
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '28px'
    },
    boxShadow: {
        xs: 'rgba(139, 92, 246, 0.35) 0px 0px 14px 0px',
        sm: 'rgba(99, 102, 241, 0.45) 0px 6px 18px 0px',
        md: 'color(srgb 0.388235 0.4 0.945098 / 0.25) 0px 0px 30px 0px',
        lg: 'rgba(0, 0, 0, 0.14) 0px 8px 32px 0px, rgba(0, 0, 0, 0.06) 0px 2px 8px 0px',
        xl: 'rgba(0, 0, 0, 0.25) 0px 20px 50px 0px',
        '2xl': 'color(srgb 0.388235 0.4 0.945098 / 0.16) 0px 0px 55px 0px, rgba(0, 0, 0, 0.35) 0px 30px 60px 0px'
    },
    transitionDuration: {
        '150': '0.15s',
        '200': '0.2s',
        '300': '0.3s',
        '450': '0.45s',
        '500': '0.5s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0, 0, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '24px'
    },
    maxWidth: {
        container: '1152px'
    }
},
  },
};
