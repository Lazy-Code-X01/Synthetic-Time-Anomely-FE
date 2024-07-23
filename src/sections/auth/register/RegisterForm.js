import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

import { useRegisterMutation } from '../../../slices/adminApiSlice';
import { setCredentials } from '../../../slices/authSlice';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInformation } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (userInformation) {
      navigate('/dashboard/app', { replace: true });
    }
  }, [navigate, userInformation]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await register({ username, address, password, email }).unwrap();
      dispatch(setCredentials(res));
      navigate('/dashboard/app', { replace: true });
    } catch (err) {
      // toast.error('Failed to register. Please check your credentials.');
      toast.error(err?.data?.message);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        {/* first name and email */}
        <Stack spacing={3} direction={'row'} sx={{ my: 2 }}>
          <TextField
            name="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {/* address */}
        <Stack spacing={3} direction={'column'} sx={{ my: 2 }}>
          <TextField
            name="address"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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

        {/* password and confirm password */}
        <Stack spacing={3} direction={'row'} sx={{ my: 2 }}>
          <TextField
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
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

          <TextField
            name="confirm password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
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

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          // onClick={submitHandler}
          sx={{
            backgroundColor: '#101723',
            '&:hover': {
              backgroundColor: '#060A10',
            },
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          Register
        </LoadingButton>
      </form>
    </>
  );
}
