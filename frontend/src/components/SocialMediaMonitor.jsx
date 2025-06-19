import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://citymall-assignment-w2q4.onrender.com/api";

function SocialMediaMonitor({ user }) {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState("");
  const [socialMediaReports, setSocialMediaReports] = useState([]);
  const [officialUpdates, setOfficialUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDisasters();
  }, []);

  useEffect(() => {
    if (selectedDisaster) {
      fetchSocialMediaReports();
      fetchOfficialUpdates();
    } else {
      setSocialMediaReports([]);
      setOfficialUpdates([]);
      setError(null);
    }
  }, [selectedDisaster]);

  const fetchDisasters = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE}/disasters`);
      setDisasters(response.data.disasters || []);
    } catch (error) {
      setError("Failed to fetch disasters.");
    }
  };

  const fetchSocialMediaReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE}/social-media/mock?disaster_id=${selectedDisaster}`
      );
      setSocialMediaReports(response.data.reports || []);
    } catch (error) {
      setError("Failed to fetch social media reports.");
      setSocialMediaReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficialUpdates = async () => {
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE}/updates/${selectedDisaster}/official-updates`
      );
      setOfficialUpdates(response.data.updates || []);
    } catch (error) {
      setError("Failed to fetch official updates.");
      setOfficialUpdates([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      default:
        return "green";
    }
  };

  return (
    <div className="social-media-monitor">
      <h2>Social Media & Official Updates Monitor</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <div className="disaster-selector">
        <select
          value={selectedDisaster}
          onChange={(e) => setSelectedDisaster(e.target.value)}
        >
          <option value="">Select a Disaster</option>
          {disasters.map((disaster) => (
            <option key={disaster.id} value={disaster.id}>
              {disaster.title}
            </option>
          ))}
        </select>
      </div>

      {selectedDisaster && (
        <div className="monitor-content">
          <div className="social-media-section">
            <h3>Social Media Reports</h3>
            {loading ? (
              <p>Loading social media reports...</p>
            ) : socialMediaReports.length === 0 ? (
              <p>No social media reports found for this disaster.</p>
            ) : (
              <div className="reports-list">
                {socialMediaReports.map((report) => (
                  <div
                    key={report.id}
                    className="report-item"
                    style={{
                      borderLeft: `4px solid ${getPriorityColor(
                        report.priority
                      )}`,
                    }}
                  >
                    <div className="report-header">
                      <strong>{report.name || "Unknown"}</strong>
                      <span className={`priority ${report.priority}`}>
                        {report.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ marginBottom: 6 }}>{report.text}</p>
                    <div className="report-meta">
                      <span>@{report.username}</span>
                      <span>Type: {report.type}</span>
                      <span>
                        {report.created_at
                          ? new Date(report.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="official-updates-section">
            <h3>Official Updates</h3>
            <div className="updates-list">
              {officialUpdates.length === 0 ? (
                <p>No official updates available for this disaster.</p>
              ) : (
                officialUpdates.map((update, index) => (
                  <div key={index} className="update-item">
                    <strong>{update.source}</strong>
                    <p>{update.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {!selectedDisaster && (
        <div style={{ marginTop: 20, color: "#666" }}>
          <p>
            Please select a disaster to view social media and official updates.
          </p>
        </div>
      )}
    </div>
  );
}

export default SocialMediaMonitor;
