import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import AccountLayout from './AccountLayout';

const statusColors = {
  pending:    { bg: 'bg-amber-100',   text: 'text-amber-700' },
  processing: { bg: 'bg-blue-100',    text: 'text-blue-700' },
  shipped:    { bg: 'bg-purple-100',  text: 'text-purple-700' },
  delivered:  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cancelled:  { bg: 'bg-red-100',     text: 'text-red-700' },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.user.getMyOrders()
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <AccountLayout title="My Account" breadcrumbLabel="Orders">
      {loading ? (
        <div className="py-16 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#252423]/40 font-bold">
            Loading your orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#252423]/60 font-bold">
            <span className="text-[#8B7355]">You </span>
            haven't placed any orders yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusStyle = statusColors[order.status] || statusColors.pending;
            return (
              <div
                key={order._id}
                className="border border-black/10 bg-white/40 p-6"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-5 pb-4 border-b border-black/10">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/50 font-bold mb-0.5">
                      Order Number
                    </p>
                    <p className="text-[13px] tracking-[0.1em] font-bold text-[#252423]">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/50 font-bold mb-0.5">
                      Placed On
                    </p>
                    <p className="text-[12px] tracking-[0.05em] text-[#252423]">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/50 font-bold mb-1">
                      Status
                    </p>
                    <span className={`inline-block px-3 py-1 text-[9px] tracking-[0.15em] uppercase font-bold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/product/${String(item.product)}`}
                      className="flex items-center gap-4 group"
                    >
                      {item.image && (
                        <img
                          src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image}
                          alt={item.title}
                          className="w-16 h-20 object-cover flex-shrink-0 bg-[#F4F2EA]"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] tracking-[0.1em] uppercase font-bold text-[#252423] group-hover:underline transition-all truncate">
                          {item.title}
                        </p>
                        <div className="flex gap-3 mt-1 flex-wrap">
                          {item.selectedSize && (
                            <span className="text-[10px] tracking-[0.1em] uppercase text-[#252423]/50 font-bold">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[10px] tracking-[0.1em] uppercase text-[#252423]/50 font-bold">
                              Colour: {item.selectedColor}
                            </span>
                          )}
                          <span className="text-[10px] tracking-[0.1em] uppercase text-[#252423]/50 font-bold">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <p className="text-[13px] font-bold text-[#252423] flex-shrink-0">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-5 pt-4 border-t border-black/10 flex justify-end">
                  <p className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#252423]">
                    Total: £{order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
};

export default Orders;
