import React, { useState } from 'react';
import { Box, Drawer, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearVendor } from '../../redux/slices/vendorSlice';
import { routes } from '../../routes/index';
import { Main, AppBarStyled, DrawerHeader } from './style';

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    dispatch(clearVendor());
    localStorage.removeItem("vendorToken");
    navigate("/");
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  // Lấy danh sách các route trong "/home"
  const homeRoute = routes.find(route => route.path === '/home');
  const menuItems = homeRoute?.children || [];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Hệ thống quản lý xe khách
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            position: 'fixed',
            height: '100%',
            overflowY: 'hidden'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Menu
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(`/home/${item.path}`)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogoutClick}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>

      {/* Modal xác nhận đăng xuất */}
      <Dialog open={logoutModalOpen} onClose={handleCloseLogoutModal}>
        <DialogTitle>Xác nhận đăng xuất</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn đăng xuất?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal}>Hủy</Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">
            Đăng xuất
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
