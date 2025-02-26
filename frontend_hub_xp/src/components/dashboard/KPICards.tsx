import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { DashboardMetrics } from "../../types/dashboard";

interface KPICardsProps {
  metrics: DashboardMetrics;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPeriod = (period: string): string => {
  // Assuming period format is "YYYY-M" (e.g., "2025-2")
  const [year, month] = period.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};

const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  const theme = useTheme();

  // Common card styles to ensure consistent sizing and prevent cropping
  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const cardContentStyle = {
    flexGrow: 1,
    padding: theme.spacing(2),
  };

  // Value display style with better overflow handling
  const valueStyle = {
    fontWeight: "bold",
    wordBreak: "break-word",
    fontSize: {
      xs: "1.5rem",
      sm: "1.8rem",
      md: "2rem",
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <Grid container spacing={3}>
      {/* Total Orders Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: "50%",
                  padding: 1,
                  display: "flex",
                }}
              >
                <ShoppingCartIcon sx={{ color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h6" component="div" ml={1} noWrap>
                Total de Pedidos
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={valueStyle}>
              {metrics.totalOrders}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Average Order Value Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: theme.palette.success.light,
                  borderRadius: "50%",
                  padding: 1,
                  display: "flex",
                }}
              >
                <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
              </Box>
              <Typography variant="h6" component="div" ml={1} noWrap>
                Valor Médio
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={valueStyle}>
              {formatCurrency(metrics.avgOrderValue)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Revenue Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: theme.palette.secondary.light,
                  borderRadius: "50%",
                  padding: 1,
                  display: "flex",
                }}
              >
                <AttachMoneyIcon sx={{ color: theme.palette.secondary.main }} />
              </Box>
              <Typography variant="h6" component="div" ml={1} noWrap>
                Receita Total
              </Typography>
            </Box>
            <Typography variant="h3" component="div" sx={valueStyle}>
              {formatCurrency(metrics.totalRevenue)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Orders by Period Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3} sx={cardStyle}>
          <CardContent sx={cardContentStyle}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: theme.palette.info.light,
                  borderRadius: "50%",
                  padding: 1,
                  display: "flex",
                }}
              >
                <ScheduleIcon sx={{ color: theme.palette.info.main }} />
              </Box>
              <Typography variant="h6" component="div" ml={1} noWrap>
                Pedidos por Período
              </Typography>
            </Box>
            {metrics.ordersByPeriod && metrics.ordersByPeriod.length > 0 ? (
              <>
                <Typography
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                  sx={{ wordBreak: "break-word" }}
                >
                  {formatPeriod(metrics.ordersByPeriod[0].period || "")}
                </Typography>
                <Typography variant="body1">
                  <strong>{metrics.ordersByPeriod[0].count || 0}</strong>{" "}
                  pedidos
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word" }}
                >
                  Receita:{" "}
                  {formatCurrency(metrics.ordersByPeriod[0].revenue || 0)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Sem dados de período disponíveis
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default KPICards;
