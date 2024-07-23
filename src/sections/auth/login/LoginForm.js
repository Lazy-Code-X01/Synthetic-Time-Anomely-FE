import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// @mui
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../../slices/adminApiSlice';
import { setCredentials } from '../../../slices/authSlice';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInformation } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInformation) {
      navigate('/dashboard/app', { replace: true });
    }
  }, [navigate, userInformation]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate('/dashboard/app', { replace: true });
      setEmail('');
      setPassword('');
    } catch (err) {
      toast.error('Failed to login. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          sx={{
            // change the focus color
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#101723',
            },
            // the label color
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: '#101723',
            },
          }}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            // change the focus color
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#101723',
            },
            // the label color
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: '#101723',
            },
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#101723',
          '&:hover': {
            backgroundColor: '#060A10',
          },
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        Login
      </LoadingButton>
    </form>
  );
}
