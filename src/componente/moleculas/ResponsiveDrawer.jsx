import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  AddShoppingCart as MontarPedidoIcon,
  Brightness4,
  Brightness7,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from "../contexts/ThemeContext";
import useBreakpoint from "../../hooks/useBreakpoint";

/**
 * Drawer responsivo que adapta comportamento por breakpoint:
 * - Mobile (xs): Drawer temporário (sobrepõe conteúdo)
 * - Tablet (sm, md): Drawer temporário colapsável  
 * - Desktop (lg+): Drawer permanente com toggle de mini-variant
 */
const ResponsiveDrawer = ({ onMenuClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const theme = useTheme();
  const { isMobile, isTablet } = useBreakpoint();

  // Determinar se deve usar drawer temporário
  const isTemporary = isMobile || isTablet;
  const drawerWidth = desktopOpen ? 240 : 64;

  const handleDrawerToggle = () => {
    if (isTemporary) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleMenuItemClick = (view) => {
    onMenuClick(view);
    // Fechar drawer em mobile após clicar
    if (isTemporary) {
      setMobileOpen(false);
    }
  };

  // Conteúdo do drawer (reutilizado para ambas variantes)
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header do Drawer */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isTemporary || desktopOpen ? "space-between" : "center",
          p: 2,
          minHeight: 64,
        }}
      >
        {(isTemporary || desktopOpen) && (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Napolitech
          </Typography>
        )}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "text.primary" }}
          size={isTemporary ? "medium" : "small"}
        >
          {isTemporary ? <ChevronLeftIcon /> : desktopOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          <ListItemButton
            onClick={() => handleMenuItemClick("dashboard")}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Dashboard" />}
          </ListItemButton>

          <ListItemButton
            onClick={() => handleMenuItemClick("pedidos")}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <AssignmentIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Pedidos Ativos" />}
          </ListItemButton>

          <ListItemButton
            onClick={() => handleMenuItemClick("montarPedido")}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <MontarPedidoIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Montar Pedido" />}
          </ListItemButton>

          <ListItemButton
            onClick={() => handleMenuItemClick("estoque")}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <InventoryIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Estoque" />}
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          <ListItemButton
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <HistoryIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Histórico" />}
          </ListItemButton>

          <ListItemButton
            onClick={() => handleMenuItemClick("configuracoes")}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            {(isTemporary || desktopOpen) && <ListItemText primary="Configurações" />}
          </ListItemButton>
        </List>
      </Box>

      {/* Footer - Toggle Tema */}
      <Box sx={{ mt: "auto", mb: 2 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            py: 1.5,
            justifyContent: isTemporary || desktopOpen ? "flex-start" : "center",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: isTemporary || desktopOpen ? 56 : 40 }}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          {(isTemporary || desktopOpen) && (
            <ListItemText primary={isDarkMode ? "Modo Claro" : "Modo Escuro"} />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* AppBar para Mobile/Tablet */}
      {isTemporary && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              Napolitech Admin
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer Temporário (Mobile/Tablet) */}
      {isTemporary && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor performance em mobile
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              bgcolor: "background.paper",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer Permanente (Desktop) */}
      {!isTemporary && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              bgcolor: "background.paper",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default ResponsiveDrawer;
