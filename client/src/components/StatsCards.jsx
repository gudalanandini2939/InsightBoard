import "../styles/dashboard.css";

function StatsCards({ records }) {
  const totalAmount = records.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const categories = new Set(records.map((item) => item.category)).size;

  const highestValue =
    records.length > 0
      ? Math.max(...records.map((item) => Number(item.amount || 0)))
      : 0;

  const stats = [
    { title: "TOTAL AMOUNT", value: `₹${totalAmount}`, icon: "💰", color: "purple" },
    { title: "TOTAL RECORDS", value: records.length, icon: "📊", color: "blue" },
    { title: "CATEGORIES", value: categories, icon: "🏷️", color: "purple" },
    { title: "HIGHEST VALUE", value: `₹${highestValue}`, icon: "⬆️", color: "orange" },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon">{stat.icon}</div>
          <p>{stat.title}</p>
          <h2>{stat.value}</h2>
          <span className={`stat-glow ${stat.color}`}></span>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;