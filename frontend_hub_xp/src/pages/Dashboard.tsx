import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import KPICards from "../components/dashboard/KPICards";
import { getSalesMetrics } from "../api/orders";
import { DashboardMetrics } from "../types/dashboard";

const defaultMetrics: DashboardMetrics = {
  totalOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  ordersByPeriod: [],
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getSalesMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral da performance do seu negócio
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <KPICards metrics={metrics} />

      {/* You could add more dashboard components here, like charts or tables */}
    </Container>
  );
};

export default Dashboard;
