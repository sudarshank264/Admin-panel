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
  Container,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
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
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Header from "../../components/Header";
import axios from "axios";
import { BASE_URL } from "../../data/constants.js";

const ReportDashboard = () => {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    region: "",
    agent: "",
    category: "",
  });
  const [reportType, setReportType] = useState("Sales");
  const [salesData, setSalesData] = useState([]);
  const [soilTestData, setSoilTestData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        from: filters.from,
        to: filters.to,
        region: filters.region,
        type: reportType.toLowerCase(), // Assuming "sales" or "soiltests"
      };

      const response = await axios.get(`${BASE_URL}/soil-test`, { params });

      if (reportType === "Sales") {
        setSalesData(response.data || []);
      } else {
        setSoilTestData(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
    setLoading(false);
  }, [filters.from, filters.to, filters.region, reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleExportCSV = () => {
    const dataToExport = reportType === "Sales" ? salesData : soilTestData;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${reportType}_Report.xlsx`);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        ml: { sm: "240px" },
        px: 4,
        py: 3,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Header
          title="Reports & Analytics"
          subtitle="Analyze sales and soil test request trends"
        />

        {/* Filters */}
        <Box mt={4} display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            displayEmpty
          >
            <MenuItem value="Sales">Sales Report</MenuItem>
            <MenuItem value="SoilTests">Soil Test Report</MenuItem>
          </Select>
          <Select
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Regions</MenuItem>
            <MenuItem value="North">North</MenuItem>
            <MenuItem value="South">South</MenuItem>
            <MenuItem value="East">East</MenuItem>
            <MenuItem value="West">West</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Charts */}
            <Grid container spacing={3} mt={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {reportType} Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      {reportType === "Sales" ? (
                        <LineChart data={salesData}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sales" stroke="#1976D2" />
                        </LineChart>
                      ) : (
                        <BarChart data={soilTestData}>
                          <XAxis dataKey="region" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="tests" fill="#D32F2F" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {reportType} Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={reportType === "Sales" ? salesData : soilTestData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey={reportType === "Sales" ? "sales" : "tests"}
                          label
                        >
                          {(reportType === "Sales" ? salesData : soilTestData).map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#1976D2",
                                  "#D32F2F",
                                  "#FFA726",
                                  "#43A047",
                                  "#8E24AA",
                                ][index % 5]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Table Section */}
            <Box mt={5}>
              <Typography variant="h6" gutterBottom>
                {reportType} Data
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: "12px", boxShadow: 2 }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                    <TableRow>
                      {reportType === "Sales" ? (
                        <>
                          <TableCell><strong>Month</strong></TableCell>
                          <TableCell><strong>Sales (₹)</strong></TableCell>
                          <TableCell><strong>Soil Tests</strong></TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell><strong>User</strong></TableCell>
                          <TableCell><strong>Region</strong></TableCell>
                          <TableCell><strong>Tests Conducted</strong></TableCell>
                          <TableCell><strong>Date</strong></TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(reportType === "Sales" ? salesData : soilTestData).map((item, index) => (
                      <TableRow key={index}>
                        {reportType === "Sales" ? (
                          <>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>{item.sales}</TableCell>
                            <TableCell>{item.tests}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{item.user}</TableCell>
                            <TableCell>{item.region}</TableCell>
                            <TableCell>{item.tests}</TableCell>
                            <TableCell>{item.date}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ReportDashboard;



// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Container,
// } from "@mui/material";
// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import Header from "../../components/Header";

// // Sample Data
// const salesData = [
//   { month: "Jan", sales: 1200, tests: 300 },
//   { month: "Feb", sales: 1500, tests: 450 },
//   { month: "Mar", sales: 2000, tests: 600 },
//   { month: "Apr", sales: 1800, tests: 500 },
//   { month: "May", sales: 2200, tests: 650 },
// ];

// const testRequests = [
//   { id: 1, user: "Amit Sharma", region: "North", tests: 5, date: "2025-03-10" },
//   { id: 2, user: "Priya Patel", region: "South", tests: 3, date: "2025-03-12" },
//   { id: 3, user: "Raj Malhotra", region: "West", tests: 8, date: "2025-03-15" },
//   { id: 4, user: "Neha Gupta", region: "East", tests: 4, date: "2025-03-18" },
// ];

// const ReportDashboard = () => {
//   const [filters, setFilters] = useState({
//     from: "",
//     to: "",
//     region: "",
//     agent: "",
//     category: "",
//   });
//   const [reportType, setReportType] = useState("Sales");

//   const handleExportCSV = () => {
//     const dataToExport = reportType === "Sales" ? salesData : testRequests;
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, `${reportType}_Report.xlsx`);
//   };

//   return (
//     <Box
//       component="main"
//       sx={{
//         flexGrow: 1,
//         ml: { sm: "240px" },
//         px: 4,
//         py: 3,
//         backgroundColor: "",
//         minHeight: "100vh",
//       }}
//     >
//       <Container maxWidth="xl">
//         <Header
//           title="Reports & Analytics"
//           subtitle="Analyze sales and soil test request trends"
//         />

//         {/* Filters */}
//         <Box mt={4} display="flex" gap={2} flexWrap="wrap" alignItems="center">
//           <TextField
//             label="From Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={filters.from}
//             onChange={(e) => setFilters({ ...filters, from: e.target.value })}
//           />
//           <TextField
//             label="To Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={filters.to}
//             onChange={(e) => setFilters({ ...filters, to: e.target.value })}
//           />
//           <Select
//             value={reportType}
//             onChange={(e) => setReportType(e.target.value)}
//             displayEmpty
//           >
//             <MenuItem value="Sales">Sales Report</MenuItem>
//             <MenuItem value="SoilTests">Soil Test Report</MenuItem>
//           </Select>
//           <Select
//             value={filters.region}
//             onChange={(e) => setFilters({ ...filters, region: e.target.value })}
//             displayEmpty
//           >
//             <MenuItem value="">All Regions</MenuItem>
//             <MenuItem value="North">North</MenuItem>
//             <MenuItem value="South">South</MenuItem>
//             <MenuItem value="East">East</MenuItem>
//             <MenuItem value="West">West</MenuItem>
//           </Select>
//           <Button variant="contained" color="primary" onClick={handleExportCSV}>
//             Export CSV
//           </Button>
//         </Box>

//         {/* Charts */}
//         <Grid container spacing={3} mt={3}>
//           <Grid item xs={12} md={6}>
//             <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   {reportType} Trends
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={250}>
//                   {reportType === "Sales" ? (
//                     <LineChart data={salesData}>
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line type="monotone" dataKey="sales" stroke="#1976D2" />
//                     </LineChart>
//                   ) : (
//                     <BarChart data={salesData}>
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="tests" fill="#D32F2F" />
//                     </BarChart>
//                   )}
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   {reportType} Distribution
//                 </Typography>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie
//                       data={salesData}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey={reportType === "Sales" ? "sales" : "tests"}
//                       label
//                     >
//                       {salesData.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={
//                             [
//                               "#1976D2",
//                               "#D32F2F",
//                               "#FFA726",
//                               "#43A047",
//                               "#8E24AA",
//                             ][index % 5]
//                           }
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Table Section */}
//         <Box mt={5}>
//           <Typography variant="h6" gutterBottom>
//             {reportType} Data
//           </Typography>
//           <TableContainer
//             component={Paper}
//             sx={{ borderRadius: "12px", boxShadow: 2 }}
//           >
//             <Table>
//               <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
//                 <TableRow>
//                   {reportType === "Sales" ? (
//                     <>
//                       <TableCell>
//                         <strong>Month</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Sales (₹)</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Soil Tests</strong>
//                       </TableCell>
//                     </>
//                   ) : (
//                     <>
//                       <TableCell>
//                         <strong>User</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Region</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Tests Conducted</strong>
//                       </TableCell>
//                       <TableCell>
//                         <strong>Date</strong>
//                       </TableCell>
//                     </>
//                   )}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reportType === "Sales"
//                   ? salesData.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{item.month}</TableCell>
//                         <TableCell>{item.sales}</TableCell>
//                         <TableCell>{item.tests}</TableCell>
//                       </TableRow>
//                     ))
//                   : testRequests.map((item, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{item.user}</TableCell>
//                         <TableCell>{item.region}</TableCell>
//                         <TableCell>{item.tests}</TableCell>
//                         <TableCell>{item.date}</TableCell>
//                       </TableRow>
//                     ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default ReportDashboard;
