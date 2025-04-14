import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";
import Header from "../../components/Header";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authToken}` };

        // Fetch all users
        const agentResponse = await fetch(`http://35.244.11.78:9101/api/user/`, { headers });
        const agentJson = await agentResponse.json();
        const allAgents = agentJson.filter(user => user.role === "AGENT");

        // Fetch all products
        const productResponse = await fetch(`http://35.244.11.78:9101/api/products`, { headers });
        const productJson = await productResponse.json();

        // Calculate total stock
        const totalStock = productJson.reduce((acc, product) => acc + (product.stock || 0), 0);

        setAgents(allAgents);
        setProducts(productJson);

        setDashboardData({
          totalAgents: allAgents.length,
          activeAgents: allAgents.filter(agent => agent.active).length,  // assuming 'active' is a boolean
          totalProducts: productJson.length,
          totalStock: totalStock
        });

        // Example dummy sales data (replace this with real endpoint if you have)
        setSalesData([
          { month: "Jan", sales: 4000 },
          { month: "Feb", sales: 3000 },
          { month: "Mar", sales: 5000 }
        ]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [authToken]);

  return (
    <Box
      sx={{
        ml: { xs: 0, sm: "250px" },
        p: 3,
        width: { xs: "100%", sm: "calc(100% - 250px)" },
        minHeight: "100vh",
      }}
    >
      <Header title="Admin Dashboard" subtitle="Platform insights & performance overview" />

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
          <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 10px rgba(255,255,255,0.2)" }}>
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
          <Card sx={{ borderRadius: "12px", boxShadow: "0px 4px 10px rgba(255,255,255,0.2)" }}>
            <CardContent>
              <Typography variant="h6">Agent Status</Typography>
              <PieChart width={350} height={300}>
                <Pie
                  data={[
                    { name: "Active", value: agents.filter(agent => agent.active).length },
                    { name: "Inactive", value: agents.filter(agent => !agent.active).length }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                >
                  <Cell fill="#4caf50" />
                  <Cell fill="#f44336" />
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
