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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { BASE_URL } from "../../data/constants.js";

const categories = ["Fertilizers", "Pesticides", "Seeds", "Equipment"];
const API_BASE = `${BASE_URL}/products`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE);
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setCategoryFilter(e.target.value);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? product.category === categoryFilter : true)
  );

  const handleAddProduct = () => {
    setEditProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditProduct(null);
  };

  const handleSaveProduct = async () => {
    try {
      if (editProduct.id) {
        await axios.put(`${API_BASE}/${editProduct.id}`, editProduct);
      } else {
        await axios.post(API_BASE, editProduct);
      }
      fetchProducts();
      handleDialogClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  return (
    <Box
      sx={{
        ml: { xs: 0, sm: "250px" },
        p: 3,
        width: { xs: "100%", sm: "calc(100% - 250px)" },
        minHeight: "100vh",
      }}
    >
      <Header title="Product Management" subtitle="Manage your product catalog" />

      {/* Summary Cards */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{filteredProducts.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Categories</Typography>
              <Typography variant="h4">{categories.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Box mt={3} display="flex" gap={2}>
        <TextField
          label="Search by Product Name"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={handleSearch}
        />
        <Select
          displayEmpty
          fullWidth
          size="small"
          value={categoryFilter}
          onChange={handleFilterChange}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* Product Table */}
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Price (₹)</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{editProduct?.id ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Product Name"
            fullWidth
            value={editProduct?.name || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
          <Select
            displayEmpty
            fullWidth
            value={editProduct?.category || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, category: e.target.value })
            }
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Price (₹)"
            type="number"
            fullWidth
            value={editProduct?.price || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, price: e.target.value })
            }
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={editProduct?.stock || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, stock: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;





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
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   MenuItem,
//   Select,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import { useState } from "react";
// import Header from "../../components/Header";

// const initialProducts = [
//   {
//     id: 1,
//     name: "Urea Fertilizer",
//     category: "Fertilizers",
//     price: 250,
//     stock: 100,
//   },
//   { id: 2, name: "Pesticide A", category: "Pesticides", price: 150, stock: 50 },
//   {
//     id: 3,
//     name: "Organic Manure",
//     category: "Fertilizers",
//     price: 300,
//     stock: 200,
//   },
//   { id: 4, name: "Hybrid Seeds", category: "Seeds", price: 500, stock: 75 },
//   {
//     id: 5,
//     name: "Insecticide X",
//     category: "Pesticides",
//     price: 180,
//     stock: 40,
//   },
// ];

// const categories = ["Fertilizers", "Pesticides", "Seeds", "Equipment"];

// const ProductManagement = () => {
//   const [products, setProducts] = useState(initialProducts);
//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);

//   const handleSearch = (e) => setSearch(e.target.value);
//   const handleFilterChange = (e) => setCategoryFilter(e.target.value);

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(search.toLowerCase()) &&
//       (categoryFilter ? product.category === categoryFilter : true)
//   );

//   const handleAddProduct = () => {
//     setEditProduct({
//       id: Date.now(),
//       name: "",
//       category: "",
//       price: "",
//       stock: "",
//     });
//     setOpenDialog(true);
//   };

//   const handleEditProduct = (product) => {
//     setEditProduct(product);
//     setOpenDialog(true);
//   };

//   const handleDeleteProduct = (id) => {
//     setProducts(products.filter((product) => product.id !== id));
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     setEditProduct(null);
//   };

//   const handleSaveProduct = () => {
//     if (editProduct.id) {
//       setProducts((prev) => {
//         const exists = prev.find((p) => p.id === editProduct.id);
//         return exists
//           ? prev.map((p) => (p.id === editProduct.id ? editProduct : p))
//           : [...prev, editProduct];
//       });
//     }
//     setOpenDialog(false);
//   };

//   return (
//     <Box
//       sx={{
//         ml: { xs: 0, sm: "250px" },
//         p: 3,
//         width: { xs: "100%", sm: "calc(100% - 250px)" },
//         minHeight: "100vh",
//         backgroundColor: "",
//       }}
//     >
//       <Header
//         title="Product Management"
//         subtitle="Manage your product catalog"
//       />

//       {/* Summary Cards */}
//       <Grid container spacing={3} mt={2}>
//         <Grid item xs={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Products</Typography>
//               <Typography variant="h4">{filteredProducts.length}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Categories</Typography>
//               <Typography variant="h4">{categories.length}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Search and Filter Section */}
//       <Box mt={3} display="flex" gap={2}>
//         <TextField
//           label="Search by Product Name"
//           variant="outlined"
//           size="small"
//           fullWidth
//           value={search}
//           onChange={handleSearch}
//         />
//         <Select
//           displayEmpty
//           fullWidth
//           size="small"
//           value={categoryFilter}
//           onChange={handleFilterChange}
//         >
//           <MenuItem value="">All Categories</MenuItem>
//           {categories.map((cat) => (
//             <MenuItem key={cat} value={cat}>
//               {cat}
//             </MenuItem>
//           ))}
//         </Select>
//         <Button variant="contained" color="primary" onClick={handleAddProduct}>
//           Add Product
//         </Button>
//       </Box>

//       {/* Product Table */}
//       <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "10px" }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <strong>Name</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Category</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Price (₹)</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Stock</strong>
//               </TableCell>
//               <TableCell>
//                 <strong>Actions</strong>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredProducts.map((product) => (
//               <TableRow key={product.id}>
//                 <TableCell>{product.name}</TableCell>
//                 <TableCell>{product.category}</TableCell>
//                 <TableCell>₹{product.price}</TableCell>
//                 <TableCell>{product.stock}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     color="primary"
//                     onClick={() => handleEditProduct(product)}
//                   >
//                     <Edit />
//                   </IconButton>
//                   <IconButton
//                     color="error"
//                     onClick={() => handleDeleteProduct(product.id)}
//                   >
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Add/Edit Product Dialog */}
//       <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
//         <DialogTitle>
//           {editProduct?.id ? "Edit Product" : "Add Product"}
//         </DialogTitle>
//         <DialogContent
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//         >
//           <TextField
//             label="Product Name"
//             fullWidth
//             value={editProduct?.name || ""}
//             onChange={(e) =>
//               setEditProduct({ ...editProduct, name: e.target.value })
//             }
//           />
//           <Select
//             displayEmpty
//             fullWidth
//             value={editProduct?.category || ""}
//             onChange={(e) =>
//               setEditProduct({ ...editProduct, category: e.target.value })
//             }
//           >
//             <MenuItem value="">Select Category</MenuItem>
//             {categories.map((cat) => (
//               <MenuItem key={cat} value={cat}>
//                 {cat}
//               </MenuItem>
//             ))}
//           </Select>
//           <TextField
//             label="Price (₹)"
//             type="number"
//             fullWidth
//             value={editProduct?.price || ""}
//             onChange={(e) =>
//               setEditProduct({ ...editProduct, price: e.target.value })
//             }
//           />
//           <TextField
//             label="Stock"
//             type="number"
//             fullWidth
//             value={editProduct?.stock || ""}
//             onChange={(e) =>
//               setEditProduct({ ...editProduct, stock: e.target.value })
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveProduct}
//             variant="contained"
//             color="primary"
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ProductManagement;
