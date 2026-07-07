const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export async function loginUser(email, password) {
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
  
    return {
      response,
      data,
    }
  }

  export async function signupUser(username, email, password) {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
  
    const data = await response.json()
  
    return {
      response,
      data,
    }
  }

  export async function getApplications(token) {
    const response = await fetch(`${API_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    const data = await response.json()
  
    return {
      response,
      data,
    }
  }