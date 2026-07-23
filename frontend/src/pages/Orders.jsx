import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';
import { Package } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { getOrders } from '../services/dataService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        const sortedOrders = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(sortedOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const currentOrders = useMemo(
    () => orders.filter((order) => order.status !== 'Delivered' && order.status !== 'Cancelled'),
    [orders],
  );
  const previousOrders = useMemo(
    () => orders.filter((order) => order.status === 'Delivered' || order.status === 'Cancelled'),
    [orders],
  );

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div className="container orders-page animate-fade-in">
      <h1 className="page-title">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders glass">
          <Package size={48} className="empty-icon" />
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here.</p>
        </div>
      ) : (
        <div className="orders-columns">
          <section className="premium-card orders-column">
            <h2>Current Orders</h2>
            <div className="orders-list">
              {currentOrders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="order-card glass">
                  <div className="order-header">
                    <div>
                      <h3>{order.restaurant_name || `Order #${order.id}`}</h3>
                      <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item-row">
                        <span className="item-qty">{item.quantity}x</span>
                        <span className="item-name">{item.menu_item?.name || 'Menu Item'}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <span>Total:</span>
                    <span className="order-total">${order.total_price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="premium-card orders-column">
            <h2>Previous Orders</h2>
            <div className="orders-list">
              {previousOrders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`} className="order-card glass">
                  <div className="order-header">
                    <div>
                      <h3>{order.restaurant_name || `Order #${order.id}`}</h3>
                      <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="order-footer">
                    <span>{order.items.length} items</span>
                    <span className="order-total">${order.total_price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Orders;
