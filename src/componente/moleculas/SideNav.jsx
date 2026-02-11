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
import { useTheme } from "../contexts/ThemeContext";

const SideNav = ({ onMenuClick }) => {
  const [open, setOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : "64px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 240 : "64px",
          boxSizing: "border-box",
          transition: "width 0.3s",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          bgcolor: isDarkMode ? "background.default" : "background.paper",
          color: isDarkMode ? "text.primary" : "text.primary",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ mt: 8 }}>
          <IconButton
            onClick={handleDrawer}
            sx={{
              ml: open ? 1 : 0.5,
              color: isDarkMode ? "text.primary" : "text.primary",
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <List>
            <ListItemButton
              onClick={() => onMenuClick("dashboard")}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <DashboardIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Dashboard" />}
            </ListItemButton>
            <ListItemButton
              onClick={() => onMenuClick("pedidos")}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <AssignmentIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Pedidos Ativos" />}
            </ListItemButton>
            <ListItemButton
              onClick={() => onMenuClick("montarPedido")}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <MontarPedidoIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Montar Pedido" />}
            </ListItemButton>
            <ListItemButton
              onClick={() => onMenuClick("estoque")}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <InventoryIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Controle de Estoque" />}
            </ListItemButton>
            <Divider />
            <ListItemButton
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <HistoryIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Histórico" />}
            </ListItemButton>
            <ListItemButton
              onClick={() => onMenuClick("configuracoes")}
              sx={{
                "&:hover": {
                  backgroundColor: isDarkMode
                    ? "action.hover"
                    : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <SettingsIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Configurações" />}
            </ListItemButton>
          </List>
        </Box>

        <Box
          sx={{
            mt: "auto",
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              "&:hover": {
                backgroundColor: isDarkMode
                  ? "action.hover"
                  : "rgba(0, 0, 0, 0.04)",
              },
              justifyContent: "center",
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 0 }}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </ListItemIcon>
            {open && <ListItemText primary="Alternar Tema" sx={{ ml: 2 }} />}
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideNav;
