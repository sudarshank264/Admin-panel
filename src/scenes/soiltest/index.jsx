import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Chip,
  Grid,
  Card,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { Visibility, GetApp } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { BASE_URL } from "../../data/constants.js";

const statusColors = {
  Pending: "warning",
  Completed: "success",
  "In Progress": "info",
};

const Soiltests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/soil-test`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching soil test data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(
    (req) =>
      req.farmer?.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? req.status === statusFilter : true)
  );

  return (
    <Box
      sx={{
        ml: { xs: 0, sm: "250px" },
        p: 3,
        width: { xs: "100%", sm: "calc(100% - 250px)" },
        minHeight: "100vh",
        backgroundColor: "",
        boxSizing: "border-box",
      }}
    >
      <Header title="Soil Test Requests" subtitle="Management Dashboard" />

      {/* Summary Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={4}>
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
            <Typography variant="h6">Total Requests</Typography>
            <Typography variant="h4" color="primary">
              {filteredRequests.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
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
            <Typography variant="h6">Pending Requests</Typography>
            <Typography variant="h4" color="primary">
              {
                filteredRequests.filter((req) => req.status === "Pending")
                  .length
              }
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
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
            <Typography variant="h6">Completed Requests</Typography>
            <Typography variant="h4" color="primary">
              {
                filteredRequests.filter((req) => req.status === "Completed")
                  .length
              }
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Box mt={3} display="flex" gap={2}>
        <TextField
          label="Search by Farmer"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          displayEmpty
          fullWidth
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
        </Select>
      </Box>

      {/* Table Section */}
      <Box mt={3}>
        <Typography variant="h6">Requests Table</Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              borderRadius: "12px",
              backgroundColor: "#212121",
              color: "white",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>
                    <strong>Farmer</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <strong>Assigned Agent</strong>
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.farmer}</TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={statusColors[request.status]}
                      />
                    </TableCell>
                    <TableCell>{request.agent}</TableCell>
                    <TableCell>
                      <IconButton color="primary" aria-label="view report">
                        <Visibility />
                      </IconButton>
                      <IconButton color="secondary" aria-label="download report">
                        <GetApp />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default Soiltests;



// import {
//   Box,
//   Paper,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   IconButton,
//   Chip,
//   Grid,
//   Card,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { Visibility, GetApp } from "@mui/icons-material";
// import { useState } from "react";
// import Header from "../../components/Header";

// const initialRequests = [
//   {
//     id: 1,
//     farmer: "Rajesh Kumar",
//     location: "Bihar",
//     status: "Pending",
//     agent: "Amit Singh",
//   },
//   {
//     id: 2,
//     farmer: "Suresh Yadav",
//     location: "Uttar Pradesh",
//     status: "Completed",
//     agent: "Ravi Verma",
//   },
//   {
//     id: 3,
//     farmer: "Anita Sharma",
//     location: "Maharashtra",
//     status: "In Progress",
//     agent: "Pooja Patel",
//   },
//   {
//     id: 4,
//     farmer: "Vikram Chauhan",
//     location: "Madhya Pradesh",
//     status: "Pending",
//     agent: "Sandeep Rao",
//   },
//   {
//     id: 5,
//     farmer: "Neha Gupta",
//     location: "Rajasthan",
//     status: "Completed",
//     agent: "Arun Mehta",
//   },
// ];

// const statusColors = {
//   Pending: "warning",
//   Completed: "success",
//   "In Progress": "info",
// };

// const Soiltests = () => {
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const filteredRequests = initialRequests.filter(
//     (req) =>
//       req.farmer.toLowerCase().includes(search.toLowerCase()) &&
//       (statusFilter ? req.status === statusFilter : true)
//   );

//   return (
//     <Box
//       sx={{
//         ml: { xs: 0, sm: "250px" },
//         p: 3,
//         width: { xs: "100%", sm: "calc(100% - 250px)" },
//         minHeight: "100vh",
//         backgroundColor: "",
//         boxSizing: "border-box",
//       }}
//     >
//       <Header title="Soil Test Requests" subtitle="Management Dashboard" />

//       {/* Summary Cards */}
//       <Grid container spacing={3} mt={2}>
//         <Grid item xs={12} sm={4}>
//           <Card
//             sx={{
//               backgroundColor: "#212121",
//               color: "#fff",
//               textAlign: "center",
//               p: 3,
//               borderRadius: "12px",
//               boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
//             }}
//           >
//             <Typography variant="h6">Total Requests</Typography>
//             <Typography variant="h4" color="primary">
//               {filteredRequests.length}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card
//             sx={{
//               backgroundColor: "#212121",
//               color: "#fff",
//               textAlign: "center",
//               p: 3,
//               borderRadius: "12px",
//               boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
//             }}
//           >
//             <Typography variant="h6">Pending Requests</Typography>
//             <Typography variant="h4" color="primary">
//               {
//                 filteredRequests.filter((req) => req.status === "Pending")
//                   .length
//               }
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Card
//             sx={{
//               backgroundColor: "#212121",
//               color: "#fff",
//               textAlign: "center",
//               p: 3,
//               borderRadius: "12px",
//               boxShadow: "0px 4px 10px rgba(255,255,255,0.2)",
//             }}
//           >
//             <Typography variant="h6">Completed Requests</Typography>
//             <Typography variant="h4" color="primary">
//               {
//                 filteredRequests.filter((req) => req.status === "Completed")
//                   .length
//               }
//             </Typography>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Search and Filter Section */}
//       <Box mt={3} display="flex" gap={2}>
//         <TextField
//           label="Search by Farmer"
//           variant="outlined"
//           size="small"
//           fullWidth
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <Select
//           displayEmpty
//           fullWidth
//           size="small"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <MenuItem value="">All Statuses</MenuItem>
//           <MenuItem value="Pending">Pending</MenuItem>
//           <MenuItem value="Completed">Completed</MenuItem>
//           <MenuItem value="In Progress">In Progress</MenuItem>
//         </Select>
//       </Box>

//       {/* Table Section */}
//       <Box mt={3}>
//         <Typography variant="h6">Requests Table</Typography>
//         <TableContainer
//           component={Paper}
//           sx={{
//             mt: 2,
//             borderRadius: "12px",
//             backgroundColor: "#212121",
//             color: "white",
//           }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ color: "white" }}>
//                   <strong>Farmer</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "white" }}>
//                   <strong>Location</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "white" }}>
//                   <strong>Status</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "white" }}>
//                   <strong>Assigned Agent</strong>
//                 </TableCell>
//                 <TableCell sx={{ color: "white" }}>
//                   <strong>Actions</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredRequests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.farmer}</TableCell>
//                   <TableCell>{request.location}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={request.status}
//                       color={statusColors[request.status]}
//                     />
//                   </TableCell>
//                   <TableCell>{request.agent}</TableCell>
//                   <TableCell>
//                     <IconButton color="primary" aria-label="view report">
//                       <Visibility />
//                     </IconButton>
//                     <IconButton color="secondary" aria-label="download report">
//                       <GetApp />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// export default Soiltests;
