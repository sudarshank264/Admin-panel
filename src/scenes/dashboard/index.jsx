import { useEffect, useState } from "react";
import { BASE_URL } from "../../data/constants.js";

import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Header from "../../components/Header";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [salesData, setSalesData] = useState([]);

  // Optional reload on mount once
  useEffect(() => {
    const reloaded = sessionStorage.getItem("dashboardReloaded");
    if (!reloaded) {
      setTimeout(() => {
        sessionStorage.setItem("dashboardReloaded", "true");
        window.location.reload();
      }, 2000);
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("auth");

        const response = await fetch(`${BASE_URL}/auth/admin/login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const data = await response.json();
        console.log("Fetched Dashboard Data:", data);

        // Example API response keys
        setDashboardData({
          totalUsers: data.totalUsers,
          totalAgents: data.totalAgents,
          totalOrders: data.totalOrders,
          totalSales: data.totalSales,
          totalSoilTests: data.totalSoilTests,
        });

        setOrders(data.recentOrders || []);
        setAgents(data.agents || []);
        setSalesData(data.salesData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box
      sx={{
        ml: { xs: 0, sm: "250px" },
        p: 3,
        width: { xs: "100%", sm: "calc(100% - 250px)" },
        minHeight: "100vh",
      }}
    >
      <Header
        title="Admin Dashboard"
        subtitle="Platform insights & performance overview"
      />

      <Grid container spacing={3} mt={3}>
        {dashboardData &&
          Object.entries(dashboardData).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card
                sx={{
                  backgroundColor: "#212121",
                  color: "#fff",
                  textAlign: "center",
                  p: 3,
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
                <Typography variant="h3" color="primary">
                  {value}
                </Typography>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
            }}
          >
            <CardContent>
              <Typography variant="h6">Sales Performance</Typography>
              <BarChart width={450} height={300} data={salesData}>
                <XAxis dataKey="month" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#29b6f6" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
            }}
          >
            <CardContent>
              <Typography variant="h6">Agent Status</Typography>
              <PieChart width={350} height={300}>
                <Pie
                  data={agents}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="status"
                  nameKey="name"
                >
                  {agents.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#4caf50", "#f44336", "#ff9800"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6">Recent Orders</Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            mt: 2,
            backgroundColor: "#212121",
            color: "white",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>Product</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={index}>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        order.status === "Delivered"
                          ? "#4caf50"
                          : order.status === "Shipped"
                          ? "#ff9800"
                          : "#f44336",
                    }}
                  >
                    {order.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Dashboard;
