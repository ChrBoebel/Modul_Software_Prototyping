const ActivitiesSection = ({ displayedActivities, activities, showAllActivities, setShowAllActivities }) => (
  <div className="activity-timeline">
    {displayedActivities.map((activity) => {
      const Icon = activity.icon;
      return (
        <div key={activity.id} className="timeline-item">
          <div className="timeline-icon" style={{ backgroundColor: activity.color }}>
            <Icon size={14} />
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-title">{activity.title}</span>
              <span className="timeline-time">{activity.timestamp}</span>
            </div>
            {activity.description && (
              <p className="timeline-description">{activity.description}</p>
            )}
            <span className="timeline-user">{activity.user}</span>
          </div>
        </div>
      );
    })}
    {activities.length > 2 && !showAllActivities && (
      <button
        type="button"
        className="btn btn-link show-more-btn"
        onClick={() => setShowAllActivities(true)}
      >
        +{activities.length - 2} weitere anzeigen
      </button>
    )}
    {showAllActivities && activities.length > 2 && (
      <button
        type="button"
        className="btn btn-link show-more-btn"
        onClick={() => setShowAllActivities(false)}
      >
        Weniger anzeigen
      </button>
    )}
  </div>
);

export default ActivitiesSection;
