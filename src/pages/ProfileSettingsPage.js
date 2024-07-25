import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    address: '',
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userInformation } = useSelector((state) => state.auth);
  const token = userInformation.token;
  const userId = userInformation._id;

  useEffect(() => {
    if (!userInformation && !token) {
      navigate('/login');
    }

    setLoadingGet(true);

    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`https://synthetictimeanomely-be.onrender.com/api/users/profile`, config);
        setProfileData(data);
        setFormData({
          username: data.username,
          email: data.email,
          password: '',
          address: data.address,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error);
        toast.error('Error fetching profile data');
      } finally {
        setLoadingGet(false);
      }
    };

    fetchProfile();
  }, [token, navigate, userInformation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('https://synthetictimeanomely-be.onrender.com/api/users/profile', formData, config);
      toast.success('Profile updated successfully');
      toast.info('You have to log in again, to preview your updated profile');
      navigate('/dashboard/app');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        toast.error(`Error updating profile: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Request data:', error.request);
        toast.error('Error updating profile: No response from server');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Error updating profile: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box width="100%" boxShadow={3} borderRadius={2} bgcolor="white" overflow="hidden">
        {loadingGet ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress color="inherit" />
          </Box>
        ) : error ? (
          <Typography>Error Fetching Data</Typography>
        ) : (
          <Box display="flex">
            <Box flex="1.5" padding={3} borderRight="1px solid #e0e0e0">
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Username:</strong> {profileData.username}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Email:</strong> {profileData.email}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Address:</strong> {profileData.address}
              </Typography>
            </Box>

            <Box flex="2" padding={3}>
              <Typography variant="h6" gutterBottom>
                Update Profile
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={12} color="inherit" />}
                    sx={{
                      backgroundColor: '#101723',
                      '&:hover': {
                        backgroundColor: '#060A10',
                      },
                    }}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileSettings;
