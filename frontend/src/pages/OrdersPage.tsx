import OrderList from "../components/OrderList";

const OrdersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      <OrderList />
    </div>
  );
};

export default OrdersPage;
