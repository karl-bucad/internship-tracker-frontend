function AuthForm({
    authMode,
    setAuthMode,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    onLogin,
    onSignup,
  }) {
    return (
      <div className="login-card">
        <h2>{authMode === "login" ? "Login" : "Sign Up"}</h2>
  
        <form onSubmit={authMode === "login" ? onLogin : onSignup}>
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
        </form>
  
        <p className="auth-switch">
          {authMode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
  
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login")
            }}
          >
            {authMode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    )
  }
  
  export default AuthForm