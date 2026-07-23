import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { getOrders } from '../services/dataService';

const steps = ['Pending', 'Preparing', 'On The Way', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const order = useMemo(() => orders.find((entry) => String(entry.id) === String(id)), [orders, id]);

  if (loading) {
    return <div className="container loading-page">Loading order details...</div>;
  }

  if (!order) {
    return <div className="container">Order not found.</div>;
  }

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="container page-section">
      <div className="premium-card order-details-page">
        <div className="section-header">
          <h1>Order {order.order_number || `#${order.id}`}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p>Restaurant: {order.restaurant_name || 'Restaurant'}</p>
        <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
        <p>Estimated Delivery: {new Date(order.estimated_delivery || order.created_at).toLocaleString()}</p>

        <h3>Timeline</h3>
        <div className="timeline">
          {steps.map((step, index) => (
            <div key={step} className={`timeline-step ${index <= currentStep ? 'active' : ''}`}>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <h3>Order Items</h3>
        <div className="order-items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item-row">
              <span>{item.quantity} x {item.menu_item?.name || 'Menu Item'}</span>
              <strong>${(item.quantity * item.price).toFixed(2)}</strong>
            </div>
          ))}
        </div>

        <h3>Payment</h3>
        <p>{order.payment_method || 'Card ending with 4831'}</p>

        <h3>Delivery Address</h3>
        <p>{order.delivery_address || 'Nasr City, Cairo'}</p>

        <div className="order-footer">
          <strong>Total</strong>
          <strong>${order.total_price.toFixed(2)}</strong>
        </div>
        <Link to="/orders" className="btn btn-secondary">Back to Orders</Link>
      </div>
    </div>
  );
};

export default OrderDetails;
