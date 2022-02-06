// import { useMediaQuery } from '@mui/material';
// import { createTheme } from '@mui/material/styles';
// import { useMemo } from 'react';

// const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
// const theme = useMemo(
//     () =>
//       createTheme({
//         palette: {
//           mode: prefersDarkMode ? 'dark' : 'light',
//           neutral: {
//             main: prefersDarkMode? '#EACA1F' : '#161616',
//             contrastText: prefersDarkMode? '#161616' : '#EACA1F',
//           },
//         },
//       }),
//     [prefersDarkMode],
//   );

//   export default theme;

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

let prefersDarkMode = false;
// Create a theme instance.
const theme = createTheme({
  palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      neutral: {
        main: prefersDarkMode? '#EACA1F' : '#161616',
        contrastText: prefersDarkMode? '#161616' : '#EACA1F',
      },
    },
});

export default theme;