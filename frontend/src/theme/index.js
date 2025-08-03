import { createTheme } from '@mui/material/styles';

/* ===== Shared Color Palettes ===== */
const vibrantColors = {
  primary: '#3f51b5',
  secondary: '#e91e63',
  info: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

const elegantColors = {
  primary: '#5c6bc0',
  secondary: '#f48fb1',
  info: '#29b6f6',
  success: '#66bb6a',
  warning: '#ffa726',
  error: '#ef5350',
};

const pastelColors = {
  primary: '#7e57c2',
  secondary: '#ffb74d',
  info: '#4fc3f7',
  success: '#81c784',
  warning: '#ffcc80',
  error: '#e57373',
};

const neonColors = {
  primary: '#00ffea',
  secondary: '#ff00d4',
  info: '#00e5ff',
  success: '#39ff14',
  warning: '#ffea00',
  error: '#ff1744',
};

/* ===== Theme Generator ===== */
const generateTheme = (mode, colors, options = {}) =>
  createTheme({
    palette: {
      mode,
      primary: { main: colors.primary, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      secondary: { main: colors.secondary, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      info: { main: colors.info, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      success: { main: colors.success, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      warning: { main: colors.warning, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      error: { main: colors.error, contrastText: mode === 'dark' ? '#0d1117' : '#fff' },
      background: mode === 'dark'
        ? { default: options.darkBg || '#121212', paper: options.darkPaper || '#1e1e1e' }
        : { default: options.lightBg || '#f5f7fa', paper: options.lightPaper || '#ffffff' },
      text: mode === 'dark'
        ? { primary: '#ffffff', secondary: '#b3b3b3' }
        : { primary: '#1a1a1a', secondary: '#4f4f4f' }
    },
    typography: {
      fontFamily: options.font || 'Inter, Roboto, sans-serif',
      h1: { fontWeight: options.hWeight || 700 },
      h2: { fontWeight: options.hWeight || 700 },
      button: { textTransform: 'none', fontWeight: options.btnWeight || 600 }
    }
  });

/* ===== 8 Themes ===== */
export const vibrantLight = generateTheme('light', vibrantColors);
export const vibrantDark = generateTheme('dark', vibrantColors);

export const elegantLight = generateTheme('light', elegantColors, { lightBg: '#f6f6f8' });
export const elegantDark = generateTheme('dark', elegantColors, { darkPaper: '#1c1c1c' });

export const pastelLight = generateTheme('light', pastelColors, {
  font: 'Poppins, Roboto, sans-serif',
  hWeight: 600,
  btnWeight: 500,
  lightBg: '#fafafa'
});
export const pastelDark = generateTheme('dark', pastelColors, {
  font: 'Poppins, Roboto, sans-serif',
  hWeight: 600,
  btnWeight: 500,
  darkBg: '#1a1a1a',
  darkPaper: '#242424'
});

export const neonLight = generateTheme('light', neonColors, {
  font: 'Orbitron, Roboto, sans-serif',
  hWeight: 800,
  btnWeight: 700,
  lightBg: '#f2f2f2'
});
export const neonDark = generateTheme('dark', neonColors, {
  font: 'Orbitron, Roboto, sans-serif',
  hWeight: 800,
  btnWeight: 700,
  darkBg: '#0a0a0a',
  darkPaper: '#141414'
});

/* ===== Utility Function ===== */
export function getTheme(style = 'vibrant', prefersDark = false) {
  switch (style) {
    case 'elegant':
      return prefersDark ? elegantDark : elegantLight;
    case 'pastel':
      return prefersDark ? pastelDark : pastelLight;
    case 'neon':
      return prefersDark ? neonDark : neonLight;
    default:
      return prefersDark ? vibrantDark : vibrantLight;
  }
}
