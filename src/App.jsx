import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [applications, setApplications] = useState([])

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length

  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length

  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsLoggedIn(true)
      fetchApplications()
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    setApplications([])
  }

  async function handleLogin(event) {
    event.preventDefault()

    const formData = new URLSearchParams()

    formData.append("username", email)
    formData.append("password", password)

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })

    const data = await response.json()

    localStorage.setItem("token", data.access_token)

    setIsLoggedIn(true)

    fetchApplications()
  }

  async function fetchApplications() {
    const token = localStorage.getItem("token")

    const response = await fetch("http://127.0.0.1:8000/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      localStorage.removeItem("token")
      setIsLoggedIn(false)
      setApplications([])
      return
    }

    const data = await response.json()

    setApplications(data)
  }

  async function handleAddApplication(event) {
    event.preventDefault()

    const token = localStorage.getItem("token")

    await fetch("http://127.0.0.1:8000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: company,
        role: role,
        status: status,
      }),
    })

    setCompany("")
    setRole("")
    setStatus("")

    fetchApplications()
  }

  async function handleDeleteApplication(id) {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:8000/applications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    fetchApplications()
  }

  async function handleUpdateApplication(event) {
    event.preventDefault()

    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:8000/applications/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: company,
        role: role,
        status: status,
      }),
    })

    setCompany("")
    setRole("")
    setStatus("")
    setEditingId(null)

    fetchApplications()
  }

  return (
    <div className="app">
      <h1>Internship Tracker</h1>

      {!isLoggedIn && (
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      )}

      {isLoggedIn && (
        <>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <div className="summary-card">
            <h2>Dashboard</h2>

            <div className="summary-stats">
              <div>
                <span>{applications.length}</span>
                <p>Total</p>
              </div>

              <div>
                <span>{appliedCount}</span>
                <p>Applied</p>
              </div>

              <div>
                <span>{interviewCount}</span>
                <p>Interviews</p>
              </div>

              <div>
                <span>{offerCount}</span>
                <p>Offers</p>
              </div>
            </div>
          </div>

          <div className="application-form-card">
            <h2>{editingId ? "Edit Application" : "Add Application"}</h2>

            <form onSubmit={editingId ? handleUpdateApplication : handleAddApplication}>
              <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
              </select>

              <button type="submit">
                {editingId ? "Update Application" : "Add Application"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setCompany("")
                    setRole("")
                    setStatus("")
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <h2>My Applications</h2>

          {applications.map((application) => (
            <div key={application.id} className="application-card">
              <h3>{application.company}</h3>
              <p>{application.role}</p>
              <span className={`status-badge ${application.status.toLowerCase()}`}>
                {application.status}
              </span>

              <button
                className="edit-button"
                onClick={() => {
                  setEditingId(application.id)
                  setCompany(application.company)
                  setRole(application.role)
                  setStatus(application.status)
                }}
              >
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteApplication(application.id)}>
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default App