import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const role = localStorage.getItem("role");

  // ✅ Token check and product fetch
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token → redirecting to login");
      navigate("/", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= payload.exp * 1000) {
        Swal.fire("Session Expired", "Please login again", "info");
        localStorage.clear();
        navigate("/", { replace: true });
        return;
      }
    } catch (e) {
      console.warn("Invalid token, redirecting...");
      localStorage.clear();
      navigate("/", { replace: true });
      return;
    }

    setIsAuthenticated(true);
    fetchProducts();
  }, [navigate]);

  // ✅ Fetch products
  async function fetchProducts() {
    try {
      const res = await api.get("/api/v1/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Add product
  async function addProduct() {
    if (role !== "ROLE_ADMIN")
      return Swal.fire("Forbidden", "Only admin can add products", "warning");
    if (!form.name || !form.price)
      return Swal.fire("Validation", "Name and Price required", "info");

    setLoading(true);
    try {
      await api.post("/api/v1/products", {
        ...form,
        price: Number(form.price),
      });
      Swal.fire("Added", "Product added successfully", "success");
      setForm({ name: "", description: "", price: "" });
      fetchProducts();
    } catch (err) {
      console.error("Add error:", err);
      Swal.fire("Error", err.response?.data || "Add failed", "error");
      setLoading(false);
    }
  }

  // ✅ Edit product
  async function editProduct(product) {
    if (role !== "ROLE_ADMIN")
      return Swal.fire("Forbidden", "Only admin can edit products", "warning");

    const { value: updated } = await Swal.fire({
      title: "Edit Product",
      html: `
        <input id="name" class="swal2-input" placeholder="Name" value="${product.name}">
        <input id="desc" class="swal2-input" placeholder="Description" value="${product.description}">
        <input id="price" class="swal2-input" type="number" placeholder="Price" value="${product.price}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          name: document.getElementById("name").value,
          description: document.getElementById("desc").value,
          price: Number(document.getElementById("price").value),
        };
      },
    });

    if (!updated) return;

    setLoading(true);
    try {
      await api.put(`/api/v1/products/${product.id}`, updated);
      Swal.fire("Updated", "Product updated successfully", "success");
      fetchProducts();
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error", "Failed to update product", "error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete product
  async function deleteProduct(id) {
    if (role !== "ROLE_ADMIN")
      return Swal.fire(
        "Forbidden",
        "Only admin can delete products",
        "warning"
      );

    const confirm = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      await api.delete(`/api/v1/products/${id}`);
      Swal.fire("Deleted", "Product removed successfully", "success");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error", "Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Logout
  function logout() {
    localStorage.clear();
    navigate("/");
  }

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1f1c2c,#928dab)",
        color: "white",
        padding: "20px",
      }}
    >
      {loading && <Loader />}

      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>PrimeTrade Dashboard</h2>
        <div>
          <span style={{ marginRight: 10 }}>
            {role === "ROLE_ADMIN" ? "Admin" : "User"}
          </span>
          <button
            onClick={logout}
            style={{
              background: "#ffcc70",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ADD PRODUCT (Admin only) */}
      {role === "ROLE_ADMIN" && (
        <div style={{ marginBottom: 20 }}>
          <h3>Add Product</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={inputStyle}
          />
          <button onClick={addProduct} style={btnStyle}>
            Add
          </button>
        </div>
      )}

      {/* PRODUCT LIST */}
      <h3>Products</h3>
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
            gap: "15px",
          }}
        >
          {products.map((p) => (
            <div key={p.id} style={cardStyle}>
              <h4>{p.name}</h4>
              <p>{p.description}</p>
              <strong>₹{p.price}</strong>

              {/* ✅ Edit & Delete (Admin only) */}
              {role === "ROLE_ADMIN" && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={() => editProduct(p)}
                    style={{
                      ...actionBtn,
                      background: "#2196f3",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      ...actionBtn,
                      background: "#f44336",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const inputStyle = {
  padding: "8px",
  marginRight: "8px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
};

const btnStyle = {
  background: "#4caf50",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const cardStyle = {
  background: "rgba(255,255,255,0.1)",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
};

const actionBtn = {
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "14px",
};
