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
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import Header from "../../components/Header";

const initialOrders = [
  {
    id: 101,
    user: "Rohan Gupta",
    product: "Organic Fertilizer",
    quantity: 2,
    payment: "Paid",
    status: "Processing",
  },
  {
    id: 102,
    user: "Anjali Mehta",
    product: "Hybrid Seeds",
    quantity: 5,
    payment: "Pending",
    status: "Shipped",
  },
  {
    id: 103,
    user: "Karan Singh",
    product: "Pesticide",
    quantity: 1,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: 104,
    user: "Simran Kaur",
    product: "Irrigation Kit",
    quantity: 3,
    payment: "Refunded",
    status: "Returned",
  },
];

const statuses = [
  "Processing",
  "Shipped",
  "Delivered",
  "Returned",
  "Cancelled",
];
const paymentStatuses = ["Paid", "Pending", "Refunded"];

const OrderManagement = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  const filteredOrders = orders.filter(
    (order) =>
      order.user.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? order.status === statusFilter : true) &&
      (paymentFilter ? order.payment === paymentFilter : true)
  );

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditOrder(null);
  };

  const handleSaveOrder = () => {
    if (editOrder) {
      setOrders((prev) =>
        prev.map((order) => (order.id === editOrder.id ? editOrder : order))
      );
    }
    setOpenDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "warning";
      case "Shipped":
        return "info";
      case "Returned":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Refunded":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        ml: { xs: 0, md: "260px" },
        p: 4,
        backgroundColor: "",
        minHeight: "100vh",
      }}
    >
      <Header
        title="Order Management"
        subtitle="Monitor and process user orders effectively"
      />

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ backgroundColor: "#ffffff", borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4" color="primary.main">
                {filteredOrders.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ backgroundColor: "#ffffff", borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4" color="warning.main">
                {filteredOrders.filter((o) => o.status === "Processing").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ backgroundColor: "#ffffff", borderRadius: 3, boxShadow: 3 }}
          >
            <CardContent>
              <Typography variant="h6">Completed Orders</Typography>
              <Typography variant="h4" color="success.main">
                {filteredOrders.filter((o) => o.status === "Delivered").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Search by User"
            fullWidth
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            size="small"
            displayEmpty
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            fullWidth
            size="small"
            displayEmpty
            value={paymentFilter}
            onChange={handlePaymentFilterChange}
          >
            <MenuItem value="">All Payment Status</MenuItem>
            {paymentStatuses.map((payment) => (
              <MenuItem key={payment} value={payment}>
                {payment}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ mt: 4, borderRadius: 3, boxShadow: 2 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
            <TableRow>
              <TableCell>
                <strong>Order ID</strong>
              </TableCell>
              <TableCell>
                <strong>User</strong>
              </TableCell>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell>
                <strong>Qty</strong>
              </TableCell>
              <TableCell>
                <strong>Payment</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Chip
                    label={order.payment}
                    color={getPaymentColor(order.payment)}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditOrder(order)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="info">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <Select
            fullWidth
            value={editOrder?.status || ""}
            onChange={(e) =>
              setEditOrder({ ...editOrder, status: e.target.value })
            }
          >
            <MenuItem value="">Select Status</MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          <Select
            fullWidth
            value={editOrder?.payment || ""}
            onChange={(e) =>
              setEditOrder({ ...editOrder, payment: e.target.value })
            }
          >
            <MenuItem value="">Select Payment</MenuItem>
            {paymentStatuses.map((payment) => (
              <MenuItem key={payment} value={payment}>
                {payment}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveOrder} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
