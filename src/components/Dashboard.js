import React from 'react';

const Dashboard = ({ economy }) => {
  return (
    <div className="dashboard" style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', minWidth: '200px' }}>
      <h3>Match Stats</h3>
      <div className="stat-card">
        <h4>Economy (Buy Out)</h4>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
          {economy || "Reading..."}
        </div>
      </div>
      {/* Add more stats here later */}
    </div>
  );
};

export default Dashboard;
