import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography } from '@mui/material';
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

  const navigate = useNavigate();
  const { userInformation } = useSelector((state) => state.auth);
  const token = userInformation.token;

  useEffect(() => {
    if (!userInformation && !token) {
      navigate('/login');
    }

    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('https://synthetictimeanomely-be.onrender.com/api/users/profile', config);
        setProfileData(data);
        setFormData({
          username: data.username,
          email: data.email,
          password: '',
          address: data.address,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error fetching profile data');
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

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('https://synthetictimeanomely-be.onrender.com/api/users/profile', formData, config);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" padding={4}>
      <Box width="100%" maxWidth="800px" display="flex">
        <Box flex="1" padding={2}>
          <Typography variant="h6">Profile Information</Typography>
          <Typography>Username: {profileData.username}</Typography>
          <Typography>Email: {profileData.email}</Typography>
          <Typography>Address: {profileData.address}</Typography>
        </Box>
        <Box flex="1" padding={2}>
          <Typography variant="h6">Update Profile</Typography>
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
            <Button type="submit" variant="contained" color="primary">
              Update Profile
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSettings;
