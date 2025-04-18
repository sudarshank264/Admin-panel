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

const API_BASE = `${BASE_URL}/products`;
const CATEGORY_API = "http://35.244.11.78:9101/api/category";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false); // New state for category dialog
  const [editProduct, setEditProduct] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" }); // State for new category
  const [images, setImages] = useState({});

  const token = localStorage.getItem("authToken");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err.response?.data || err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      console.log("Fetched products:", response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const createCategory = async () => {
    try {
      const response = await axios.post(
        CATEGORY_API,
        {
          name: newCategory.name,
          description: newCategory.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Created category:", response.data);
      fetchCategories(); // Refresh categories
      setNewCategory({ name: "", description: "" }); // Reset form
      setOpenCategoryDialog(false); // Close dialog
    } catch (err) {
      console.error("Failed to create category:", err.response?.data || err.message);
    }
  };

  const fetchImage = async (imageUrl) => {
    if (imageUrl && !images[imageUrl]) {
      let image = imageUrl.startsWith("http")
        ? imageUrl
        : `${BASE_URL}/uploads/${imageUrl}`;
      try {
        const response = await axios.get(image, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });
        const imageObjectURL = URL.createObjectURL(response.data);
        setImages((prevImages) => ({
          ...prevImages,
          [imageUrl]: imageObjectURL,
        }));
      } catch (err) {
        console.error("Failed to fetch image:", err);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        const imageUrl = product.imageUrl;
        if (imageUrl && !images[imageUrl]) {
          fetchImage(imageUrl);
        }
      });
    }
  }, [products, images]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilterChange = (e) => setCategoryFilter(e.target.value);

  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch = Object.values(product).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        (typeof value === "object"
          ? Object.values(value).some(
              (v) =>
                v !== null &&
                v !== undefined &&
                v.toString().toLowerCase().includes(searchTerm)
            )
          : value.toString().toLowerCase().includes(searchTerm))
    );
    const matchesCategory = categoryFilter
      ? (typeof product.category === "object"
          ? product.category?.name
          : product.category) === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditProduct({
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      imageFile: null,
    });
    setOpenProductDialog(true);
  };

  const handleAddCategory = () => {
    setNewCategory({ name: "", description: "" });
    setOpenCategoryDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditProduct({
      ...product,
      category: typeof product.category === "object" ? product.category?.name : product.category,
      imageFile: null,
    });
    setOpenProductDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_BASE}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err.response?.data || err.message);
    }
  };

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
    setEditProduct(null);
  };

  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false);
    setNewCategory({ name: "", description: "" });
  };

  const handleSaveProduct = async () => {
    if (!editProduct) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("description", editProduct.description);
    const category = categories.find((cat) => cat.name === editProduct.category);
    formData.append("categoryId", category ? category.categoryId : "");
    formData.append("price", editProduct.price);
    formData.append("stock", editProduct.stock);

    if (editProduct.imageFile) {
      formData.append("image", editProduct.imageFile);
    }

    try {
      if (editProduct.productId) {
        await axios.put(`${API_BASE}/${editProduct.productId}`, formData, config);
        if (editProduct.stock !== undefined) {
          await axios.put(
            `${API_BASE}/${editProduct.productId}/stock`,
            { quantity: editProduct.stock },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } else {
        await axios.post(`${API_BASE}/`, formData, config);
      }
      fetchProducts();
      handleProductDialogClose();
    } catch (err) {
      console.error("Failed to save product:", err.response?.data || err.message);
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

      <Box mt={3} display="flex" gap={2}>
        <TextField
          label="Search by Any Field"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearch}
          sx={{ flex: 1 }}
        />
        <Select
          displayEmpty
          size="small"
          value={categoryFilter}
          onChange={handleFilterChange}
          sx={{ flex: 1 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.categoryId} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddProduct}
          sx={{ flex: 1, whiteSpace: "nowrap" }}
        >
          Add Product
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddCategory}
          sx={{ flex: 1, whiteSpace: "nowrap" }}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Image</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                <strong>Price (₹)</strong>
              </TableCell>
              <TableCell>
                <strong>Stock</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>
                  {images[product.imageUrl] ? (
                    <img
                      src={images[product.imageUrl]}
                      alt={product.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      width={50}
                      height={50}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bgcolor="#f0f0f0"
                      borderRadius={1}
                      fontSize="12px"
                      color="#999"
                    >
                      No Image
                    </Box>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {typeof product.category === "object" && product.category !== null
                    ? product.category.name
                    : product.category || "N/A"}
                </TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditProduct(product)}
                    sx={{ color: "#fff" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Dialog */}
      <Dialog open={openProductDialog} onClose={handleProductDialogClose} fullWidth>
        <DialogTitle>
          {editProduct?.productId ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Product Name"
            fullWidth
            value={editProduct?.name || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, name: e.target.value })
            }
          />
          <TextField
            label="Product Description"
            fullWidth
            value={editProduct?.description || ""}
            onChange={(e) =>
              setEditProduct({ ...editProduct, description: e.target.value })
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
              <MenuItem key={cat.categoryId} value={cat.name}>
                {cat.name}
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditProduct({ ...editProduct, imageFile: e.target.files[0] })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={handleCategoryDialogClose} fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Category Name"
            fullWidth
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <TextField
            label="Category Description"
            fullWidth
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={createCategory}
            variant="contained"
            color="primary"
            disabled={!newCategory.name} // Disable if name is empty
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagement;