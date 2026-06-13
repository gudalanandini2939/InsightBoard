import "../styles/dashboard.css";

function AnalyticsChart({ records = [] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const monthlyTotals = months.map((month, index) => {
    return records
      .filter((item) => {
        if (!item.date) return false;
        return new Date(item.date).getMonth() === index;
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  });

  const maxAmount = Math.max(...monthlyTotals, 1);

  const categories = ["Food & Drink", "Transport", "Shopping", "Utilities"];

  const categoryTotals = categories.map((category) => {
    return records
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  });

  return (
    <>
      <div className="chart-card">
        <h3>MONTHLY ANALYTICS</h3>

        <div className="bar-chart">
          {months.map((month, index) => (
            <div className="bar-item" key={month}>
              <div
                className="bar"
                style={{
                  height: `${(monthlyTotals[index] / maxAmount) * 130}px`,
                }}
              ></div>

              <small>₹{monthlyTotals[index]}</small>
              <span>{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-card category-card">
        <h3>CATEGORY ANALYTICS</h3>

        <div className="category-list">
          {categories.map((category, index) => (
            <div className="category-row" key={category}>
              <div className="category-left">
                <span className={`dot dot-${index}`}></span>
                {category}
              </div>

              <strong>₹{categoryTotals[index]}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AnalyticsChart;