const ScoreHistorySection = ({ scoreHistory }) => (
  <div className="table-wrapper">
    <table className="data-table score-table">
      <thead>
        <tr>
          <th>Schritt</th>
          <th>Vorher</th>
          <th>Nachher</th>
          <th>Grund</th>
        </tr>
      </thead>
      <tbody>
        {scoreHistory.map((item) => (
          <tr key={item.step}>
            <td>{item.step}</td>
            <td>{item.scoreAlt}</td>
            <td>{item.scoreNeu}</td>
            <td>{item.grund}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ScoreHistorySection;
