import { useState, useEffect } from "react"
import "./App.css"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [applications, setApplications] = useState([])

  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [appliedDate, setAppliedDate] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("newest")
  const [errorMessage, setErrorMessage] = useState("")
  const [authMode, setAuthMode] = useState("login")
  const [username, setUsername] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const appliedCount = applications.filter(
    (application) => application.status === "Applied"
  ).length

  const interviewCount = applications.filter(
    (application) => application.status === "Interview"
  ).length

  const offerCount = applications.filter(
    (application) => application.status === "Offer"
  ).length

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter == "All" || application.status == statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortOrder == "newest") {
      return b.applied_date.localeCompare(a.applied_date)
    }

    return a.applied_date.localeCompare(b.applied_date)
  })

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

    setIsLoading(true)

    try {
      const formData = new URLSearchParams()

      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.detail || "Login failed")
        return
      }

      setErrorMessage("")
      setSuccessMessage("")

      localStorage.setItem("token", data.access_token)

      setIsLoggedIn(true)

      await fetchApplications()
    } catch (error) {
      setErrorMessage("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.detail || "Signup failed")
        return
      }

      setErrorMessage("")
      setSuccessMessage("Account created successfully. You can now log in.")
      setAuthMode("login")
      setUsername("")
      setPassword("")
    } catch (error) {
      setErrorMessage("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchApplications() {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/applications`, {
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

    await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: company,
        role: role,
        status: status,
        notes: notes,
        applied_date: appliedDate,
      }),
    })

    setCompany("")
    setRole("")
    setStatus("")
    setNotes("")
    setAppliedDate("")

    fetchApplications()
  }

  async function handleDeleteApplication(id) { 
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    )

    if (!confirmed) {
      return
    }

    const token = localStorage.getItem("token")

    await fetch(`${API_URL}/applications/${id}`, {
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

    await fetch(`${API_URL}/applications/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: company,
        role: role,
        status: status,
        notes: notes,
        applied_date: appliedDate,
      }),
    })

    setCompany("")
    setRole("")
    setStatus("")
    setNotes("")
    setAppliedDate("")
    setEditingId(null)

    fetchApplications()
  }

  return (
    <div className="app">
      <h1>Internship Tracker</h1>

      {!isLoggedIn && (
        <div className="login-card">
          <h2>{authMode === "login" ? "Login" : "Sign Up"}</h2>

          <form onSubmit={authMode === "login" ? handleLogin : handleSignup}>
            {authMode === "signup" && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : authMode === "login"
                  ? "Login"
                  : "Sign Up"}
            </button>

            {errorMessage && (
              <p className="error-message">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

          </form>

          <p className="auth-switch">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login")
                setErrorMessage("")
                setSuccessMessage("")
              }}
            >
              {authMode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
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

              <input
                type="date"
                value={appliedDate}
                onChange={(event) => setAppliedDate(event.target.value)}
              />

              <textarea
                placeholder="Notes (optional)"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />

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
                    setNotes("")
                    setAppliedDate("")
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <h2>My Applications</h2>

          <input
            className="search-input"
            type="text"
            placeholder="Search by company or role"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {filteredApplications.length == 0 && (
            <p className="no-results">No applications found.</p>
          )}

          {sortedApplications.map((application) => (
            <div key={application.id} className="application-card">
              <h3>{application.company}</h3>
              <p>{application.role}</p>

              {application.applied_date && (
                <p className="application-date">
                  Applied: {application.applied_date}
                </p>
              )}

              {application.notes && (
                <p className="application-notes">{application.notes}</p>
              )}

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
                  setNotes(application.notes || "")
                  setAppliedDate(application.applied_date || "")
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