import { useEffect, useState } from "react";
import "./App.css"; // import the CSS file

function App() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchPosts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: "", content: "", category: "" });
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
      method: "DELETE",
    });
    fetchPosts();
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, content: post.content, category: post.category });
    setEditingId(post._id);
  };

  return (
    <div className="container">
      <h1 className="title">Posts</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <button type="submit" className="btn">
          {editingId ? "Update Post" : "Create Post"}
        </button>
      </form>

      {/* Posts List */}
      {posts.length === 0 ? (
        <p className="empty">No posts available</p>
      ) : (
        <ul className="post-list">
          {posts.map((p) => (
            <li key={p._id} className="post-item">
              <h3>{p.title}</h3>
              <p>{p.content}</p>
              <small>Category: {p.category || "none"}</small>
              <div className="actions">
                <button className="btn edit" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn delete" onClick={() => handleDelete(p._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;