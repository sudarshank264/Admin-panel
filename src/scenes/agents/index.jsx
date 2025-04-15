import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, IconButton, Button, Grid, Card, MenuItem, Select, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { BASE_URL } from "../../data/constants";
import axios from "axios";

const regions = ["North", "South", "East", "West"];

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editAgent, setEditAgent] = useState(null);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/admin/agents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setAgents(response.data);
      } else if (Array.isArray(response.data.agents)) {
        setAgents(response.data.agents);
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([]);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setRegionFilter(e.target.value);

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name?.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter ? agent.location === regionFilter : true;
    return matchesSearch && matchesRegion;
  });

  const handleAddAgent = () => {
    setEditAgent({ name: "", region: "", phoneNumber: "", status: "Active" });
    setOpenDialog(true);
  };

  const handleEditAgent = (agent) => {
    setEditAgent({
      userId: agent.userId,
      name: agent.name || "",
      region: agent.location || "",
      phoneNumber: agent.mobileNumber || "",
      status: agent.active  ? "Active" : "Inactive",
      
    });
    setOpenDialog(true);
  };

  const handleDeleteAgent = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${BASE_URL}/admin/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditAgent(null);
  };

  const handleSaveAgent = async () => {
    if (!editAgent?.name?.trim() || !editAgent?.region?.trim() || !editAgent?.phoneNumber?.trim()) {
      alert("Please fill in Name, Region, and Mobile Number.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const agentData = {
        name: editAgent.name.trim(),
        location: editAgent.region.trim(), // Correct key mapping
        phoneNumber: editAgent.phoneNumber.trim(),
        active: editAgent.status === "Active" // Convert string to boolean
      };

      if (editAgent.userId) {
        await axios.put(`${BASE_URL}/admin/agents/${editAgent.userId}`, agentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BASE_URL}/admin/agents`, agentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchAgents();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving agent:", error);
      alert("Failed to save agent. Check console for details.");
    }
  };

  return (
    <Box sx={{
      p: 3,
      ml: { xs: 0, md: "260px" },
      width: { xs: "100%", md: "calc(100% - 260px)" },
      minHeight: "100vh",
      backgroundColor: "#0f0f0f",
      color: "white"
    }}>
      <Header
        title="Agent Management"
        subtitle="Admins oversee the recruitment, onboarding, and performance management of agents."
      />

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: "#1a1a1a",
            color: "#fff",
            textAlign: "center",
            p: 3,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}>
            <Typography variant="h6">Total Agents</Typography>
            <Typography variant="h3" color="white">{agents.length}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            backgroundColor: "#1a1a1a",
            color: "#fff",
            textAlign: "center",
            p: 3,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
          }}>
            <Typography variant="h6">Active Agents</Typography>
            <Typography variant="h3" color="white">
              {agents.filter((a) => a.active).length}
            </Typography>
            
          </Card>
        </Grid>
        
      </Grid>

      {/* <Box mt={4} display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
        <TextField
          label="Search by Agent Name"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={handleSearch}
          sx={{
            backgroundColor: "#1f1f1f",
            input: { color: "white" }
          }}
        />
        <Select
          displayEmpty
          fullWidth
          size="small"
          value={regionFilter}
          onChange={handleFilterChange}
          sx={{ backgroundColor: "#1f1f1f", color: "white" }}
        >
          <MenuItem value="">All Regions</MenuItem>
          {regions.map((reg) => (
            <MenuItem key={reg} value={reg}>{reg}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={handleAddAgent}>
          Add Agent
        </Button>
      </Box> */}
      <Box mt={4} display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
  <TextField
    label="Search by Agent Name"
    variant="outlined"
    size="small"
    fullWidth
    value={search}
    onChange={handleSearch}
    sx={{
      backgroundColor: "#1f1f1f",
      input: { color: "white" },
      height: "40px",   // FIXED height same as Select
      ".MuiInputBase-root": {
        height: "40px"
      }
    }}
  />
  <Select
    displayEmpty
    fullWidth
    size="small"
    value={regionFilter}
    onChange={handleFilterChange}
    sx={{
      backgroundColor: "#1f1f1f",
      color: "white",
      height: "40px",  // FIXED height
      ".MuiSelect-select": {
        display: "flex",
        alignItems: "center"
      }
    }}
  >
    <MenuItem value="">All Regions</MenuItem>
    {regions.map((reg) => (
      <MenuItem key={reg} value={reg}>{reg}</MenuItem>
    ))}
  </Select>
  <Button
    variant="contained"
    color="primary"
    sx={{ height: "40px", minWidth: "120px" }}  // Button matches height
    onClick={handleAddAgent}
  >
    Add Agent
  </Button>
</Box>


      <TableContainer component={Paper} sx={{
        mt: 4,
        borderRadius: "16px",
        backgroundColor: "#1b1b1b"
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#ccc" }}>Name</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Region</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Mobile</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Status</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow key={agent.userId} hover>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.location || "-"}</TableCell>
                <TableCell>{agent.mobileNumber || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={agent.active ? "Active" : "Inactive"}
                    color={agent.active ? "success" : "error"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {/* <IconButton color="primary" onClick={() => handleEditAgent(agent)}>
                    <Edit />
                  </IconButton> */}
                  <IconButton 
  onClick={() => handleEditAgent(agent)} 
  sx={{ color: "white" }}
>
  <Edit />
</IconButton>

                  <IconButton color="error" onClick={() => handleDeleteAgent(agent.userId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredAgents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No agents found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1a1a1a", color: "white" }}>
          {editAgent?.userId ? "Edit Agent" : "Add Agent"}
        </DialogTitle>
        <DialogContent sx={{
          backgroundColor: "#121212",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}>
          <TextField
            label="Agent Name"
            fullWidth
            value={editAgent?.name || ""}
            onChange={(e) => setEditAgent({ ...editAgent, name: e.target.value })}
          />
          <Select
            displayEmpty
            fullWidth
            value={editAgent?.region || ""}
            onChange={(e) => setEditAgent({ ...editAgent, region: e.target.value })}
          >
            <MenuItem value="">Select Region</MenuItem>
            {regions.map((reg) => (
              <MenuItem key={reg} value={reg}>{reg}</MenuItem>
            ))}
          </Select>
          <TextField
            label="Mobile Number"
            fullWidth
            value={editAgent?.phoneNumber || ""}
            onChange={(e) => setEditAgent({ ...editAgent, phoneNumber: e.target.value })}
          />
          <Select
            fullWidth
            value={editAgent?.status || "Active"}
            onChange={(e) => setEditAgent({ ...editAgent, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1a1a1a" }}>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveAgent} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentManagement;
