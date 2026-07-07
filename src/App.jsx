import { useState, useEffect } from "react"
import toast, { Toaster } from "react-hot-toast"

import Dashboard from "./components/Dashboard"
import SearchControls from "./components/SearchControls"
import ApplicationCard from "./components/ApplicationCard"
import ApplicationForm from "./components/ApplicationForm"
import AuthForm from "./components/AuthForm"
import {
  loginUser,
  signupUser,
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "./services/api"
import "./App.css"

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
  const [authMode, setAuthMode] = useState("login")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false)

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
      const { response, data } = await loginUser(email, password)

      if (!response.ok) {
        toast.error(data.detail || "Login failed")
        return
      }

      localStorage.setItem("token", data.access_token)

      setIsLoggedIn(true)

      await fetchApplications()
    } catch (error) {
      toast.error("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSignup(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const { response, data } = await signupUser(
        username,
        email,
        password
      )

      if (!response.ok) {
        toast.error(data.detail || "Signup failed")
        return
      }

      toast.success("Account created successfully! Please log in.")
      setAuthMode("login")
      setUsername("")
      setPassword("")
    } catch (error) {
      toast.error("Unable to connect to the server")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchApplications() {
    const token = localStorage.getItem("token")

    const { response, data } = await getApplications(token)

    if (!response.ok) {
      localStorage.removeItem("token")
      setIsLoggedIn(false)
      setApplications([])
      return
    }

    setApplications(data)
  }

  async function handleAddApplication(event) {
    event.preventDefault()

    if (isSubmittingApplication) {
      return
    }

    setIsSubmittingApplication(true)

    try {
      const token = localStorage.getItem("token")

      const { response, data } = await addApplication(token, {
        company: company,
        role: role,
        status: status,
        notes: notes,
        applied_date: appliedDate,
      })

      if (!response.ok) {
        toast.error(data.detail || "Unable to add application")
        return
      }

      setCompany("")
      setRole("")
      setStatus("")
      setNotes("")
      setAppliedDate("")

      await fetchApplications()
      toast.success("Application added successfully!")
    } finally {
      setIsSubmittingApplication(false)
    }
  }

  async function handleDeleteApplication(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    )

    if (!confirmed) {
      return
    }

    const token = localStorage.getItem("token")

    await deleteApplication(token, id)

    await fetchApplications()
    toast.success("Application deleted successfully!")
  }

  async function handleUpdateApplication(event) {
    event.preventDefault()

    if (isSubmittingApplication) {
      return
    }

    setIsSubmittingApplication(true)

    try {
      const token = localStorage.getItem("token")

      const { response, data } = await updateApplication(token, editingId, {
        company: company,
        role: role,
        status: status,
        notes: notes,
        applied_date: appliedDate,
      })
      
      if (!response.ok) {
        toast.error(data.detail || "Unable to update application")
        return
      }

      setCompany("")
      setRole("")
      setStatus("")
      setNotes("")
      setAppliedDate("")
      setEditingId(null)

      await fetchApplications()
      toast.success("Application updated successfully!")
    } finally {
      setIsSubmittingApplication(false)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <div className="app">
        <h1>Internship Tracker</h1>

        {!isLoggedIn && (
          <AuthForm
            authMode={authMode}
            setAuthMode={setAuthMode}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        )}

        {isLoggedIn && (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>

            <Dashboard
              totalCount={applications.length}
              appliedCount={appliedCount}
              interviewCount={interviewCount}
              offerCount={offerCount}
            />

            <ApplicationForm
              editingId={editingId}
              company={company}
              setCompany={setCompany}
              role={role}
              setRole={setRole}
              status={status}
              setStatus={setStatus}
              appliedDate={appliedDate}
              setAppliedDate={setAppliedDate}
              notes={notes}
              setNotes={setNotes}
              isSubmittingApplication={isSubmittingApplication}
              onSubmit={editingId ? handleUpdateApplication : handleAddApplication}
              onCancel={() => {
                setEditingId(null)
                setCompany("")
                setRole("")
                setStatus("")
                setNotes("")
                setAppliedDate("")
              }}
            />

            <h2>My Applications</h2>

            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {filteredApplications.length == 0 && (
              <p className="no-results">No applications found.</p>
            )}

            {sortedApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onEdit={(application) => {
                  setEditingId(application.id)
                  setCompany(application.company)
                  setRole(application.role)
                  setStatus(application.status)
                  setNotes(application.notes || "")
                  setAppliedDate(application.applied_date || "")
                }}
                onDelete={handleDeleteApplication}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default App