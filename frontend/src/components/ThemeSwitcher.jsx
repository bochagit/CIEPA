import * as React from 'react';
import { useTheme, useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ThemeSwitcher() {
  const theme = useTheme();

  const { mode, setMode } = useColorScheme();

  const currentMode = mode || 'light'

  const toggleMode = React.useCallback(() => {
    setMode(currentMode === 'dark' ? 'light' : 'dark');
  }, [setMode, currentMode]);

  return (
    <Tooltip
      title={`${currentMode === 'dark' ? 'Light' : 'Dark'} mode`}
      enterDelay={1000}
    >
      <div>
        <IconButton
          size="small"
          aria-label={`Switch to ${currentMode === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleMode}
        >
          {theme.getColorSchemeSelector ? (
            <React.Fragment>
              <LightModeIcon
                sx={{
                  display: 'inline',
                  [theme.getColorSchemeSelector('dark')]: {
                    display: 'none',
                  },
                }}
              />
              <DarkModeIcon
                sx={{
                  display: 'none',
                  [theme.getColorSchemeSelector('dark')]: {
                    display: 'inline',
                  },
                }}
              />
            </React.Fragment>
          ) : null}
        </IconButton>
      </div>
    </Tooltip>
  );
}
