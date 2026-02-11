import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  ShoppingBag as OrdersIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import useBreakpoint from "../../hooks/useBreakpoint";

const DashboardCard = ({
  title,
  value,
  icon,
  color,
  onClick,
  loading = false,
  isMobile,
}) => {
  const getIcon = () => {
    const iconSize = isMobile ? 32 : 48;
    switch (icon) {
      case "pending":
        return <PendingIcon sx={{ fontSize: iconSize, color: color }} />;
      case "total":
        return <OrdersIcon sx={{ fontSize: iconSize, color: color }} />;
      case "money":
        return <MoneyIcon sx={{ fontSize: iconSize, color: color }} />;
      case "done":
        return <CompletedIcon sx={{ fontSize: iconSize, color: color }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: { xs: 100, sm: 100, md: 120, lg: 130 },
        width: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: 6,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.2rem" },
            mb: { xs: 0.5, md: 1 },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem", lg: "2rem" },
            fontWeight: 600,
          }}
        >
          {loading ? "..." : value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: { xs: "10px", md: "50%" },
          p: { xs: 1.5, md: 2, lg: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: { xs: 1, md: 2 },
        }}
      >
        {getIcon()}
      </Box>
    </Paper>
  );
};

const DashboardCards = ({ cardsData = [], onCardClick, loading = false }) => {
  const { isMobile } = useBreakpoint();

  return (
    <Box
      sx={{
        width: "100%",
        mb: { xs: 3, md: 4, lg: 5 },
      }}
    >
      <Grid container spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard
              {...card}
              loading={loading}
              onClick={() => onCardClick && onCardClick(card, index)}
              isMobile={isMobile}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCards;
