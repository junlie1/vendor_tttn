import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import PendingPage from "../pages/PendingPage/PendingPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import BusType from "../components/BusType/BusTypes";
import Buses from "../components/Bus/Buses";
import Routes from "../components/Routes/BusRoutes";
import Schedules from "../components/Schedules/Schedules";
import Setting from "../components/Settings/Settings";

import {
    Dashboard as DashboardIcon,
    DirectionsBus,
    LocalShipping,
    Schedule,
    Route,
    Person,
    Settings
  } from '@mui/icons-material';
import Drivers from "../components/Customers/Driver";
import Dashboard from "../components/Dashboard/Dashboard";

export const routes = [
    {
        path: '/home',
        page: HomePage,
        isPrivate: true,
        children: [ 
            {
                path: 'dashboard',
                page: Dashboard,
                title: 'Dashboard',
                icon: <DashboardIcon />
            },
            {
                path: 'bus-types',
                page: BusType,
                title: 'Quản lý loại xe',
                icon: <DirectionsBus />
            },
            {
                path: 'buses',
                page: Buses,
                title: 'Quản lý xe',
                icon: <LocalShipping />
            },
            {
                path: 'schedules',
                page: Schedules,
                title: 'Quản lý lịch trình',
                icon: <Schedule />
            },
            {
                path: 'routes',
                page: Routes,
                title: 'Quản lý tuyến đường',
                icon: <Route />
            },
            {
                path: 'drivers',
                page: Drivers,
                title: 'Quản lý tài xế',
                icon: <Person />
            },
            {
                path: 'setting',
                page: Setting,
                title: 'Settings',
                icon: <Settings />
            },
        ],
    },
    {
        path: '/',
        page: LoginPage
    },
    {
        path: '/signup',
        page: RegisterPage
    },
    {
        path: '/pending',
        page: PendingPage
    }
];