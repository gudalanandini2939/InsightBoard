import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import AnalyticsChart from "../components/AnalyticsChart";
import API from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [userName, setUserName] = useState("User");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [form, setForm] = useState({
    title: "",
    category: "",
    amount: "",
    date: "",
    note: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) setUserName(storedUser.name);
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await API.get("/records");
      setRecords(res.data);
    } catch (error) {
      console.log("Fetch records error:", error);
    }
  };

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingRecord(null);
    setForm({
      title: "",
      category: "",
      amount: "",
      date: "",
      note: "",
    });
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setForm({
      title: record.title,
      category: record.category,
      amount: record.amount,
      date: record.date,
      note: record.note || "",
    });
    setShowModal(true);
  };

  const saveRecord = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.amount || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingRecord) {
        const res = await API.put(`/records/${editingRecord._id}`, {
          ...form,
          amount: Number(form.amount),
        });

        setRecords(
          records.map((item) =>
            item._id === editingRecord._id ? res.data : item
          )
        );
      } else {
        const res = await API.post("/records", {
          ...form,
          amount: Number(form.amount),
        });

        setRecords([res.data, ...records]);
      }

      setShowModal(false);
      setEditingRecord(null);
      setForm({
        title: "",
        category: "",
        amount: "",
        date: "",
        note: "",
      });
    } catch (error) {
      console.log("Save record error:", error);
      alert("Record not saved");
    }
  };

  const deleteRecord = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/records/${id}`);
      setRecords(records.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Delete record error:", error);
      alert("Record not deleted");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="stars"></div>

      <div className="dashboard-shell">
        <Navbar userName={userName} onLogout={logout} />

        <main className="dashboard-content">
          <section className="hero">
            <div>
              <h1>
                Welcome back, <span>{userName}</span> 👋
              </h1>
              <p>Track data, manage records, and analyze your insights.</p>
            </div>

            <div className="hero-actions">
              <button className="hero-add-btn" onClick={openAddModal}>
                + Add Record
              </button>
            </div>
          </section>

          <StatsCards records={records} />

          <section className="tools-row">
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
            </select>
          </section>

          <section className="charts-grid">
            <AnalyticsChart records={records} />
          </section>

          <section className="bottom-grid new-bottom">
            <div className="panel activity-panel">
              <h3>RECENT ACTIVITY</h3>

              {records.length === 0 ? (
                <div className="activity-empty">
                  <div className="activity-icon">✨</div>
                  <h4>No activity yet</h4>
                  <p>Add your first record to start tracking analytics.</p>
                </div>
              ) : (
                <div className="timeline">
                  {records.slice(0, 5).map((item) => (
                    <div className="timeline-item" key={item._id}>
                      <span></span>
                      <div>
                        <h4>{item.title}</h4>
                        <p>
                          {item.category} • ₹{item.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel recent-panel">
              <h3>RECENT RECORDS</h3>

              {filteredRecords.length === 0 ? (
                <div className="empty-state">
                  <div>📬</div>
                  <p>No matching records found.</p>
                </div>
              ) : (
                <div className="record-list">
                  {filteredRecords.map((item) => (
                    <div className="record-item" key={item._id}>
                      <div>
                        <h4>{item.title}</h4>
                        <p>
                          {item.category} • {item.date}
                        </p>
                      </div>

                      <div className="record-actions">
                        <strong>₹{item.amount}</strong>
                        <button onClick={() => openEditModal(item)}>Edit</button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteRecord(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="record-modal">
            <div className="modal-header">
              <div>
                <h2>{editingRecord ? "Edit Record" : "Add New Record"}</h2>
                <p>
                  {editingRecord
                    ? "Update your record details."
                    : "Enter your transaction or analytics data."}
                </p>
              </div>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={saveRecord} className="record-form modal-form">
              <input
                type="text"
                name="title"
                placeholder="Record title"
                value={form.title}
                onChange={handleChange}
              />

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
              </select>

              <input
                type="number"
                name="amount"
                placeholder="Amount / Value"
                value={form.amount}
                onChange={handleChange}
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />

              <textarea
                name="note"
                placeholder="Short note (optional)"
                value={form.note}
                onChange={handleChange}
              ></textarea>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingRecord ? "Update Record →" : "Save Record →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;