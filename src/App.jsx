import { useState } from "react"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [applications, setApplications] = useState([])

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

    const data = await response.json()

    localStorage.setItem("token", data.access_token)

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
  
      <h2>My Applications</h2>
  
      {applications.map((application) => (
        <div key={application.id}>
          <h3>{application.company}</h3>
          <p>{application.role}</p>
          <p>{application.status}</p>
        </div>
      ))}
    </div>
  )
}

export default App