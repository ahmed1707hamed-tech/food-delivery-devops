const statusClassNames = {
  Pending: 'status-pending',
  Preparing: 'status-preparing',
  'On The Way': 'status-ontheway',
  Delivered: 'status-delivered',
  Cancelled: 'status-cancelled',
};

const StatusBadge = ({ status }) => {
  const normalized = status || 'Pending';
  return <span className={`status-badge ${statusClassNames[normalized] || 'status-pending'}`}>{normalized}</span>;
};

export default StatusBadge;
