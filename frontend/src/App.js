import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import theme from 'theme';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ConfirmProvider } from 'hooks/Confirm ';
import { AlertProvider } from 'hooks/Alart';
import { AuthProvider } from 'hooks/AuthProvider';

// ==============================|| APP ||============================== //

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
