import { useState, useEffect } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [applications, setApplications] = useState([])
  
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      setIsLoggedIn(true)
      fetchApplications()
    }
  }, [])

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
    <div>
      <h1>Internship Tracker</h1>
  
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
  
      {isLoggedIn && (
        <>
          <h2>Add Application</h2>
  
          <form onSubmit={editingId ? handleUpdateApplication : handleAddApplication}>
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
  
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
  
            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            />
  
            <button type="submit">
              {editingId ? "Update Application" : "Add Application"}
            </button>
          </form>
  
          <h2>My Applications</h2>
  
          {applications.map((application) => (
            <div key={application.id}>
              <h3>{application.company}</h3>
              <p>{application.role}</p>
              <p>{application.status}</p>
  
              <button
                onClick={() => {
                  setEditingId(application.id)
                  setCompany(application.company)
                  setRole(application.role)
                  setStatus(application.status)
                }}
              >
                Edit
              </button>
  
              <button onClick={() => handleDeleteApplication(application.id)}>
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