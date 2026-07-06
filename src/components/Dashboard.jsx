function Dashboard({ totalCount, appliedCount, interviewCount, offerCount }) {
    return (
      <div className="summary-card">
        <h2>Dashboard</h2>
  
        <div className="summary-stats">
          <div>
            <span>{totalCount}</span>
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
    )
  }
  
  export default Dashboard