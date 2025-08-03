import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

import Routes from 'routes';

import { getTheme } from 'theme';

import { ConfirmProvider } from 'hooks/Confirm ';
import { AlertProvider } from 'hooks/Alart';
import { AuthProvider } from 'hooks/AuthProvider';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const style = 'elegant';
const theme = getTheme(style, prefersDark);

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AlertProvider>
          <ConfirmProvider>
            <AuthProvider>
              <Routes />
            </AuthProvider>
          </ConfirmProvider>
        </AlertProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
