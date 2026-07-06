function ApplicationCard({ application, onEdit, onDelete }) {
    return (
      <div className="application-card">
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
          onClick={() => onEdit(application)}
        >
          Edit
        </button>
  
        <button
          className="delete-button"
          onClick={() => onDelete(application.id)}
        >
          Delete
        </button>
      </div>
    )
  }
  
  export default ApplicationCard