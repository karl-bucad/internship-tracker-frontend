function ApplicationForm({
    editingId,
    company,
    setCompany,
    role,
    setRole,
    status,
    setStatus,
    appliedDate,
    setAppliedDate,
    notes,
    setNotes,
    jobUrl,
    setJobUrl,
    isSubmittingApplication,
    onSubmit,
    onCancel,
}) {
    return (
        <div className="application-form-card">
            <h2>{editingId ? "Edit Application" : "Add Application"}</h2>

            <form className="application-form" onSubmit={onSubmit}>
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
                    <option value="Rejected">Rejected</option>
                </select>

                <input
                    type="date"
                    value={appliedDate || ""}
                    onChange={(event) => setAppliedDate(event.target.value)}
                />

                <input
                    type="url"
                    placeholder="Job posting URL (optional)"
                    value={jobUrl}
                    onChange={(event) => setJobUrl(event.target.value)}
                />

                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                />

                <button type="submit" disabled={isSubmittingApplication}>
                    {isSubmittingApplication
                        ? editingId
                            ? "Updating..."
                            : "Adding..."
                        : editingId
                            ? "Update Application"
                            : "Add Application"}
                </button>

                {editingId && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    )
}

export default ApplicationForm