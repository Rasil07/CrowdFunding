import React from 'react';

import Main from './Main';
import { AppContextProvider } from './context/App/context';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
const theme = createMuiTheme({
  palette: {
    primary: { 500: '#467fcf' },
    text: {
      default: '#FDF8F5',
      light: '#E8CEBF',
      dark: '#DDAF94',
      complementaryGreen: '#266150',
      darkHighlight: '#4F4846',
      // primary: '#3C1874',
      // secondary: '#DE354C',
    },
  },
  background: {
    body: '#DADED4',
    default: '#FDF8F5',
    lightContainer: '#E8CEBF',
    darkContainer: '#DDAF94',
    complementaryGreen: '#266150',
    darkHighlight: '#4F4846',
    transparent: 'rgba(255,255,255,0)',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <Main />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
