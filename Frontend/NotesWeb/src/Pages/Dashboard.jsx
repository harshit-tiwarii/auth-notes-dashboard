import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setProfile(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const { data } = await api.get("/notes", { params: { q } });
      setNotes(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotes();
  }, []);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(fetchNotes, 400);
    return () => clearTimeout(t);
  }, [q]);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Handle delete
  const deleteNote = async (id) => {
    // if (!window.confirm("Delete this note?")) return;
    await api.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {profile?.name}</p>
          <p><span className="font-semibold">Email:</span> {profile?.email}</p>
        </div>

        <button
          onClick={() => setShowProfileForm(true)}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Profile
        </button>

        <button
          onClick={logout}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 md:hidden bg-gray-800 text-white px-3 py-2 rounded"
      >
        ☰
      </button>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-64 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {profile?.name}</p>
              <p><span className="font-semibold">Email:</span> {profile?.email}</p>
            </div>

            <button
              onClick={() => setShowProfileForm(true)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Update Profile
            </button>

            <button
              onClick={logout}
              className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>

            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <button
            onClick={() => { setEditNote(null); setShowForm(true); }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Note
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
            placeholder="Search notes..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {/* Notes List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <div key={n._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{n.title}</h3>
              <p className="text-sm text-gray-600">{n.content}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { setEditNote(n); setShowForm(true); }}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteNote(n._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for Note Form */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <h2 className="text-xl font-bold mb-4">{editNote ? "Edit Note" : "Add Note"}</h2>
          <NoteForm
            note={editNote}
            onClose={() => setShowForm(false)}
            onSaved={fetchNotes}
          />
        </Modal>
      )}

      {/* Modal for Profile Form */}
      {showProfileForm && (
        <Modal onClose={() => setShowProfileForm(false)}>
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>
          <ProfileForm
            profile={profile}
            onClose={() => setShowProfileForm(false)}
            onSaved={fetchProfile}
          />
        </Modal>
      )}
    </div>
  );
}

/* Note Form */
function NoteForm({ note, onClose, onSaved }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note) {
      await api.put(`/notes/${note._id}`, { title, content });
    } else {
      await api.post("/notes", { title, content });
    }
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows="4"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Save
        </button>
      </div>
    </form>
  );
}

/* Profile Form */
function ProfileForm({ profile, onClose, onSaved }) {
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/auth/update", { name, email, password });
    onSaved();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Save Changes
        </button>
      </div>
    </form>
  );
}

/* Reusable Modal */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
