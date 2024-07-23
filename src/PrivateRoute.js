import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

const PrivateRoute = () => {
  const { userInformation } = useSelector((state) => state.auth);

  return userInformation ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
