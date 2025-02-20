import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Outlet } from 'react-router-dom';

const HomePage = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default HomePage;
