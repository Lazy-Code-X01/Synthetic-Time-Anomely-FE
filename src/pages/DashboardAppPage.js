import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

// components
import Iconify from '../components/iconify';

// sections
import { AppWebsiteVisits, AppWidgetSummary } from '../sections/@dashboard/app';

import LoadingSpinner from '../components/loadingSpinner/Loader';
import DataUpload from '../components/dataUpload/DataUpload';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { userInformation } = useSelector((state) => state.auth);
  const [greeting, setGreeting] = useState('');

  const token = userInformation.token;
  console.log(token);

  useEffect(() => {
    const getGreeting = () => {
      const currentTime = new Date();
      const nigeriaTimezoneOffset = 60;

      const nigeriaTime = new Date(currentTime.getTime() + nigeriaTimezoneOffset * 60000);
      const currentHour = nigeriaTime.getHours();

      if (currentHour >= 5 && currentHour < 12) {
        return '🌅 Good Morning';
      }
      if (currentHour >= 12 && currentHour < 18) {
        return '🌞 Good Afternoon';
      }

      return '🌆 Good Evening';
    };

    const greetingMessage = getGreeting();
    setGreeting(greetingMessage);
  });

  return (
    <>
      <Helmet>
        <title> Dashboard | Anomaly Detection </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi {userInformation.username}, {greeting}
        </Typography>
        <DataUpload />
      </Container>
    </>
  );
}
