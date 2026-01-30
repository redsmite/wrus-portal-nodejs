export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-4">
      <h1 className="mb-4">Welcome to WRUS Portal</h1>
      {user && (
        <p>
          Logged in as: <strong>{user.username}</strong> | Role: <strong>{user.role}</strong>
        </p>
      )}

      {/* You can add dashboard cards, stats, or quick links here */}
      <div className="mt-5">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card p-3 bg-primary text-white">Total Permits</div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 bg-success text-white">Active Users</div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 bg-warning text-white">Pending Forms</div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 bg-info text-white">Map Overview</div>
          </div>
        </div>
      </div>
    </div>
  );
}
