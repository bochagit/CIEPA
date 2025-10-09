import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import { useNavigate } from 'react-router-dom';
import CiepaLogo from './components/CiepaLogo';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Alert from '@mui/material/Alert';
import { authenticateUser } from './data/mockUsers'


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(123, 44%, 47%, .3), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignIn(props) {
  const [userError, setUserError] = React.useState(false);
  const [userErrorMessage, setUserErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loginError, setLoginError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    if(!validateInputs()) {
      return;
    }

    setIsLoading(true)
    setLoginError('')

    const data = new FormData(event.currentTarget);
    const username = data.get('user')
    const password = data.get('password')

    // Simula delay de red
    setTimeout(() => {
      const user = authenticateUser(username, password)

      if (user) {
        if(rememberMe) {
          localStorage.setItem('currentUser', JSON.stringify(user))
          // Limpiar sessionStorage si existía
          sessionStorage.removeItem('currentUser')
        } else {
          sessionStorage.setItem('currentUser', JSON.stringify(user))
          // Limpiar localStorage si existía
          localStorage.removeItem('currentUser')
        }

        window.dispatchEvent(new CustomEvent('userChanged'))

        console.log('login exitoso: ', user)

        navigate('/')
      } else {
        setLoginError('Usuario o contraseña incorrectos')
      }

      setIsLoading(false)
    }, 500)
  };

  const validateInputs = () => {
    const user = document.getElementById('user');
    const password = document.getElementById('password');

    let isValid = true;

    if (!user.value || user.value.length < 3) {
      setUserError(true);
      setUserErrorMessage('Ingrese un usuario valido.');
      isValid = false;
    } else {
      setUserError(false);
      setUserErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }}/>
        <Button onClick={handleBackToHome} sx={{position: 'fixed', top: '1rem', left: '1rem', color: 'text.secondary'}}>
          Volver a inicio
        </Button>
        <Card variant="outlined">
          <CiepaLogo />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Iniciar sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >

            {/* Mostrar error de login */}
            {
              loginError && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              )
            }

            <FormControl>
              <FormLabel htmlFor="user">Usuario</FormLabel>
              <TextField
                error={userError}
                helperText={userErrorMessage}
                id="user"
                type="text"
                name="user"
                placeholder="usuario..."
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={userError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Recordarme"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
