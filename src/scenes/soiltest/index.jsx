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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { BASE_URL } from "../../data/constants";

const statusColors = {
  PENDING: "warning",
  COMPLETED: "success",
  "IN PROGRESS": "info",
};

const SoilTests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    farmer: "",
    location: "",
    soilType: "",
    status: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${BASE_URL}/soil-test/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching soil test data:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const farmerName = req?.userName?.toLowerCase() || "";
    const location = req?.farmLocation?.toLowerCase() || "";
    const soilType = req?.soilType?.toLowerCase() || "";
    const status = req?.status?.toLowerCase() || "";
    return (
      farmerName.includes(filters.farmer.toLowerCase()) &&
      location.includes(filters.location.toLowerCase()) &&
      soilType.includes(filters.soilType.toLowerCase()) &&
      (filters.status ? status === filters.status.toLowerCase() : true)
    );
  });

  return (
    <Box
      sx={{
        ml: { xs: 0, sm: "250px" },
        p: 3,
        width: { xs: "100%", sm: "calc(100% - 250px)" },
        minHeight: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#121212",
        color: "#fff",
      }}
    >
      <Header title="Soil Test Reports" subtitle="Monitoring & Analysis" />

      <Grid container spacing={3} mt={2}>
  {[
    { label: "Total Reports", value: filteredRequests.length },
    {
      label: "Pending Reports",
      value: filteredRequests.filter(
        (req) => req.status?.toUpperCase() === "PENDING"
      ).length,
    },
    {
      label: "Completed Reports",
      value: filteredRequests.filter(
        (req) => req.status?.toUpperCase() === "COMPLETED"
      ).length,
    },
  ].map((item, i) => (
    <Grid item xs={12} sm={4} key={i}>
      <Card
        sx={{
          backgroundColor: "#1e1e1e",
          textAlign: "center",
          p: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(255,255,255,0.15)",
        }}
      >
        <Typography variant="h6">{item.label}</Typography>
        <Typography variant="h4" sx={{ color: "#fff" }}>
          {item.value}
        </Typography>
      </Card>
    </Grid>
  ))}
</Grid>


      <Box mt={4} display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="Search by Farmer"
          variant="outlined"
          size="small"
          value={filters.farmer}
          onChange={(e) => setFilters({ ...filters, farmer: e.target.value })}
        />
        <TextField
          label="Search by Location"
          variant="outlined"
          size="small"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <TextField
          label="Search by Soil Type"
          variant="outlined"
          size="small"
          value={filters.soilType}
          onChange={(e) => setFilters({ ...filters, soilType: e.target.value })}
        />
        <Select
          displayEmpty
          size="small"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="IN PROGRESS">In Progress</MenuItem>
        </Select>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Reports Table
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#1e1e1e",
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Farmer</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Location</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Soil Type</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Test Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff" }}>pH</TableCell>
                  <TableCell sx={{ color: "#fff" }}>N (mg/kg)</TableCell>
                  <TableCell sx={{ color: "#fff" }}>P (mg/kg)</TableCell>
                  <TableCell sx={{ color: "#fff" }}>K (mg/kg)</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.soilTestId || Math.random()}>
                    <TableCell>{request.userName || "N/A"}</TableCell>
                    <TableCell>{request.farmLocation || "N/A"}</TableCell>
                    <TableCell>{request.soilType || "N/A"}</TableCell>
                    <TableCell>{request.testDate || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status || "Unknown"}
                        color={
                          statusColors[request.status?.toUpperCase()] ||
                          "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{request.phLevel ?? "-"}</TableCell>
                    <TableCell>{request.nitrogen ?? "-"}</TableCell>
                    <TableCell>{request.phosphorus ?? "-"}</TableCell>
                    <TableCell>{request.potassium ?? "-"}</TableCell>
                    <TableCell>
                    <IconButton
  sx={{ color: "green" }}
  onClick={() => {
    setSelectedRequest(request);
    setOpen(true);
  }}
>
  <Visibility />
</IconButton>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Modal for Viewing Details */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Soil Test Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest ? (
            <Box>
              <Typography gutterBottom><strong>Farmer:</strong> {selectedRequest.userName}</Typography>
              <Typography gutterBottom><strong>Location:</strong> {selectedRequest.farmLocation}</Typography>
              <Typography gutterBottom><strong>Soil Type:</strong> {selectedRequest.soilType}</Typography>
              <Typography gutterBottom><strong>Test Date:</strong> {selectedRequest.testDate}</Typography>
              <Typography gutterBottom><strong>Status:</strong> {selectedRequest.status}</Typography>
              <Typography gutterBottom><strong>pH Level:</strong> {selectedRequest.phLevel}</Typography>
              <Typography gutterBottom><strong>Nitrogen:</strong> {selectedRequest.nitrogen}</Typography>
              <Typography gutterBottom><strong>Phosphorus:</strong> {selectedRequest.phosphorus}</Typography>
              <Typography gutterBottom><strong>Potassium:</strong> {selectedRequest.potassium}</Typography>
            </Box>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SoilTests;
