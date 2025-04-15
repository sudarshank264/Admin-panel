import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Header from "../../components/Header";
import axios from "axios";
import { BASE_URL } from "../../data/constants";

const token = localStorage.getItem("authToken");

const ReportDashboard = () => {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [reportType, setReportType] = useState("SoilTests");
  const [soilTests, setSoilTests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [soilResponse, orderResponse] = await Promise.all([
        axios.get(`${BASE_URL}/soil-test/reports`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setSoilTests(soilResponse.data || []);
      setOrders(orderResponse.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const displayValue = (value: any) => {
    return typeof value === "string" && value.trim() !== "" ? value : "N/A";
  };
  

  const handleExportCSV = () => {
    const dataToExport = reportType === "SoilTests" ? soilTests : orders;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, `${reportType}_Report.xlsx`);
  };

  const filteredData = (reportType === "SoilTests" ? soilTests : orders).filter((item) => {
    const date = new Date(item.testDate || item.orderDate);
    const fromDate = filters.from ? new Date(filters.from) : null;
    const toDate = filters.to ? new Date(filters.to) : null;
    if (fromDate && date < fromDate) return false;
    if (toDate && date > toDate) return false;
    return true;
  });

  if (loading) {
    return (
      <Box component="main" sx={{ flexGrow: 1, ml: { sm: "240px" }, px: 4, py: 3, minHeight: "100vh", backgroundColor: "#121212" }}>
        <Typography variant="h6" color="primary">Loading data, please wait...</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, ml: { sm: "240px" }, px: 4, py: 3, minHeight: "100vh", backgroundColor: "#121212" }}>
      <Container maxWidth="xl">
        <Header title="Reports & Analytics" subtitle="Soil Tests and Orders Overview" />

        <Box mt={4} display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            sx={{
              input: { 
                color: "#fff",
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'  // this inverts the default black icon to white
                }
              },
              label: { color: "#fff" },
              "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" } }
            }}
          />
          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            sx={{
              input: { 
                color: "#fff",
                '&::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'  // this inverts the default black icon to white
                }
              },
              label: { color: "#fff" },
              "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" } }
            }} />
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            displayEmpty
            sx={{ color: "#fff", borderColor: "#555", ".MuiOutlinedInput-notchedOutline": { borderColor: "#555" } }}
          >
            <MenuItem value="SoilTests">Soil Test Report</MenuItem>
            <MenuItem value="Orders">Order Report</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleExportCSV}>Export CSV</Button>
        </Box>

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#1e1e2f", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{reportType} Trends</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  {reportType === "SoilTests" ? (
                    <BarChart data={filteredData}>
                      <XAxis dataKey="farmLocation" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="phLevel" fill="#1976D2" />
                    </BarChart>
                  ) : (
                    <LineChart data={filteredData}>
                      <XAxis dataKey="orderId" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="totalAmount" stroke="#D32F2F" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#1e1e2f", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{reportType} Distribution</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={filteredData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey={reportType === "SoilTests" ? "phLevel" : "totalAmount"}
                      label
                    >
                      {filteredData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={["#1976D2", "#D32F2F", "#FFA726", "#43A047", "#8E24AA"][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>{reportType} Data</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: 2, backgroundColor: "#1e1e2f" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {reportType === "SoilTests" ? (
                    <>
                      <TableCell sx={{ color: "#fff" }}><strong>Farm Location</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Soil Type</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Status</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Test Date</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>pH Level</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Nitrogen</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Phosphorus</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Potassium</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>User Name</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>User Mobile</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Agent Name</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Agent Mobile</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Recommended Crops</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Recommended Products</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Soil Preparations</strong></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={{ color: "#fff" }}><strong>Order ID</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Order Date</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Status</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Total Amount</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>Agent Name</strong></TableCell>
                      <TableCell sx={{ color: "#fff" }}><strong>User Name</strong></TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredData.map((item) =>
    reportType === "SoilTests" ? (
      <TableRow key={item.soilTestId}>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.farmLocation)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.soilType)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.status)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.testDate)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.phLevel)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.nitrogen)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.phosphorus)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.potassium)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.user?.fullName)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.user?.mobileNumber)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.agent?.fullName)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.agent?.mobileNumber)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{Array.isArray(item.recommendedCrops) ? item.recommendedCrops.join(", ") : "N/A"}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{Array.isArray(item.recommendedProducts) ? item.recommendedProducts.join(", ") : "N/A"}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{Array.isArray(item.soilPreparations) ? item.soilPreparations.join(", ") : "N/A"}</TableCell>
      </TableRow>
    ) : (
      <TableRow key={item.orderId}>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.orderId)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.orderDate)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.status)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.totalAmount)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.agentName)}</TableCell>
        <TableCell sx={{ color: "#fff" }}>{displayValue(item.userName)}</TableCell>
      </TableRow>
    )
  )}
</TableBody>

            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportDashboard;
