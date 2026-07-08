function Dashboard({ totalCount, appliedCount, interviewCount, offerCount }) {
    return (
      <div className="summary-card">
        <h2>Dashboard</h2>
  
        <div className="summary-stats">
          <div className="stat-card">
            <span>{totalCount}</span>
            <p>Total</p>
          </div>
  
          <div className="stat-card">
            <span>{appliedCount}</span>
            <p>Applied</p>
          </div>
  
          <div className="stat-card">
            <span>{interviewCount}</span>
            <p>Interviews</p>
          </div>
  
          <div className="stat-card">
            <span>{offerCount}</span>
            <p>Offers</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default Dashboard