import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

const customShadows = [...defaultTheme.shadows];

// Tu color principal verde #44ad4a
export const brand = {
  50: '#f1f8f2',
  100: '#ddeede',
  200: '#b6d6ba',
  300: '#88bd8e',
  400: '#5ca464',
  500: '#44ad4a', // Tu color exacto
  600: '#3a8b3f',
  700: '#316f35',
  800: '#2b5a2e',
  900: '#254a27',
};

// Tu color secundario azul #27a8e1
export const secondary = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#27a8e1', // Tu color exacto
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
};

export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

// Verde complementario basado en tu verde principal
export const green = {
  50: 'hsl(122, 39%, 95%)',
  100: 'hsl(122, 39%, 88%)',
  200: 'hsl(122, 39%, 80%)',
  300: 'hsl(122, 39%, 65%)',
  400: 'hsl(122, 39%, 55%)',
  500: 'hsl(122, 39%, 48%)', // Mismo que tu marca
  600: 'hsl(122, 39%, 42%)',
  700: 'hsl(122, 39%, 35%)',
  800: 'hsl(122, 39%, 25%)',
  900: 'hsl(122, 39%, 15%)',
};

// Naranja complementario al verde
export const orange = {
  50: 'hsl(30, 100%, 97%)',
  100: 'hsl(30, 92%, 90%)',
  200: 'hsl(30, 94%, 80%)',
  300: 'hsl(30, 90%, 65%)',
  400: 'hsl(30, 90%, 50%)',
  500: 'hsl(30, 90%, 40%)',
  600: 'hsl(30, 91%, 35%)',
  700: 'hsl(30, 94%, 30%)',
  800: 'hsl(30, 95%, 25%)',
  900: 'hsl(30, 93%, 20%)',
};

// Rojo complementario
export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 50%)',
  500: 'hsl(0, 90%, 40%)',
  600: 'hsl(0, 91%, 35%)',
  700: 'hsl(0, 94%, 30%)',
  800: 'hsl(0, 95%, 25%)',
  900: 'hsl(0, 93%, 20%)',
};

export const getDesignTokens = (mode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(122, 39%, 5%, 0.7) 0px 4px 16px 0px, hsla(122, 39%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(122, 39%, 5%, 0.07) 0px 4px 16px 0px, hsla(122, 39%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[300],
        main: brand[500], // #44ad4a
        dark: brand[700],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          contrastText: '#ffffff',
          light: brand[400],
          main: brand[500],
          dark: brand[600],
        }),
      },
      secondary: {
        light: secondary[300],
        main: secondary[500], // #27a8e1
        dark: secondary[700],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          contrastText: '#ffffff',
          light: secondary[400],
          main: secondary[500],
          dark: secondary[600],
        }),
      },
      info: {
        light: secondary[200],
        main: secondary[400],
        dark: secondary[600],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          contrastText: '#ffffff',
          light: secondary[300],
          main: secondary[400],
          dark: secondary[700],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[600],
        }),
      },
      error: {
        light: red[300],
        main: red[500],
        dark: red[700],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[600],
        }),
      },
      success: {
        light: green[300],
        main: green[500],
        dark: green[700],
        contrastText: '#ffffff',
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[600],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
        ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[500],
        ...(mode === 'dark' && {
          primary: 'hsl(0, 0%, 100%)',
          secondary: gray[400],
        }),
      },
      action: {
        hover: alpha(brand[500], 0.08),
        selected: alpha(brand[500], 0.12),
        ...(mode === 'dark' && {
          hover: alpha(brand[600], 0.08),
          selected: alpha(brand[600], 0.12),
        }),
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[300],
        main: brand[500], // #44ad4a
        dark: brand[700],
        contrastText: '#ffffff',
      },
      secondary: {
        light: secondary[300],
        main: secondary[500], // #27a8e1
        dark: secondary[700],
        contrastText: '#ffffff',
      },
      info: {
        light: secondary[200],
        main: secondary[400],
        dark: secondary[600],
        contrastText: '#ffffff',
      },
      warning: {
        light: orange[300],
        main: orange[500],
        dark: orange[700],
        contrastText: '#ffffff',
      },
      error: {
        light: red[300],
        main: red[500],
        dark: red[700],
        contrastText: '#ffffff',
      },
      success: {
        light: green[300],
        main: green[500],
        dark: green[700],
        contrastText: '#ffffff',
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[500],
      },
      action: {
        hover: alpha(brand[500], 0.08),
        selected: alpha(brand[500], 0.12),
      },
      baseShadow:
        'hsla(122, 39%, 5%, 0.07) 0px 4px 16px 0px, hsla(122, 39%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: '#ffffff',
        light: brand[400],
        main: brand[500], // #44ad4a
        dark: brand[600],
      },
      secondary: {
        contrastText: '#ffffff',
        light: secondary[400],
        main: secondary[500], // #27a8e1
        dark: secondary[600],
      },
      info: {
        contrastText: '#ffffff',
        light: secondary[300],
        main: secondary[400],
        dark: secondary[700],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[600],
        contrastText: '#ffffff',
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[600],
        contrastText: '#ffffff',
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[600],
        contrastText: '#ffffff',
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: 'hsl(220, 30%, 7%)',
      },
      text: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: gray[400],
      },
      action: {
        hover: alpha(brand[600], 0.08),
        selected: alpha(brand[600], 0.12),
      },
      baseShadow:
        'hsla(122, 39%, 5%, 0.7) 0px 4px 16px 0px, hsla(122, 39%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

const defaultShadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];

export const shadows = defaultShadows;