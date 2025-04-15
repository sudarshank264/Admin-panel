import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, IconButton, Button, Grid,
  Card, CardContent, MenuItem, Select, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

import { BASE_URL } from "../../data/constants";

const statuses = ["REQUESTED", "SHIPPED", "DELIVERED", "FAILED"];
const paymentStatuses = ["INITIATED", "PAID", "PENDING", "REFUNDED"];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const token = localStorage.getItem("authToken");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  const filteredOrders = orders.filter((order) =>
    (!search || order.userName?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter ? order.orderStatus === statusFilter : true) &&
    (paymentFilter ? order.paymentStatus === paymentFilter : true)
  );

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setOpenDialog(true);
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setViewOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditOrder(null);
  };

  const handleSaveOrder = async () => {
    try {
      const payload = { status: editOrder.orderStatus };
      await axios.put(`${BASE_URL}/orders/${editOrder.orderId}/status`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
      handleDialogClose();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED": return "success";
      case "REQUESTED": return "warning";
      case "SHIPPED": return "info";
      case "FAILED": return "error";
      default: return "default";
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "PAID": return "success";
      case "INITIATED": return "warning";
      case "REFUNDED": return "error";
      default: return "default";
    }
  };

  return (
    <Box sx={{ ml: { xs: 0, md: "260px" }, p: 4, minHeight: "100vh" }}>
      <Header title="Order Management" subtitle="Monitor and process user orders effectively" />

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4" color="white">{filteredOrders.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4" color="warning.main">
                {filteredOrders.filter((o) => o.orderStatus === "PROCESSING").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Completed Orders</Typography>
              <Typography variant="h4" color="success.main">
                {filteredOrders.filter((o) => o.orderStatus === "DELIVERED").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={4}>
          <TextField label="Search by User" fullWidth size="small" value={search} onChange={handleSearch} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Select fullWidth size="small" displayEmpty value={statusFilter} onChange={handleStatusFilterChange}>
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>) }
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <Select fullWidth size="small" displayEmpty value={paymentFilter} onChange={handlePaymentFilterChange}>
            <MenuItem value="">All Payment Status</MenuItem>
            {paymentStatuses.map((payment) => <MenuItem key={payment} value={payment}>{payment}</MenuItem>) }
          </Select>
        </Grid>
      </Grid>

      <TableContainer sx={{ mt: 4, borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Order ID</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Agent ID</strong></TableCell>
              <TableCell><strong>Payment</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId} hover>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.agentId}</TableCell>
                <TableCell><Chip label={order.paymentStatus} color={getPaymentColor(order.paymentStatus)} /></TableCell>
                <TableCell><Chip label={order.orderStatus} color={getStatusColor(order.orderStatus)} /></TableCell>
                <TableCell>
                  <IconButton sx={{ color: "white" }} onClick={() => handleEditOrder(order)}><Edit /></IconButton>
                  <IconButton sx={{ color: "green" }} onClick={() => handleViewOrder(order.orderId)}><Visibility /></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteOrder(order.orderId)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Order Status</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <Select
            fullWidth
            value={editOrder?.orderStatus || ""}
            onChange={(e) => setEditOrder({ ...editOrder, orderStatus: e.target.value })}
          >
            <MenuItem value="">Select Status</MenuItem>
            {statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>) }
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveOrder} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {viewOrder && (
            <>
              <Typography><strong>Order ID:</strong> {viewOrder.orderId}</Typography>
              <Typography><strong>User:</strong> {viewOrder.userName}</Typography>
              <Typography><strong>Agent ID:</strong> {viewOrder.agentId}</Typography>
              <Typography><strong>Payment:</strong> {viewOrder.paymentStatus}</Typography>
              <Typography><strong>Status:</strong> {viewOrder.orderStatus}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrder(null)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
