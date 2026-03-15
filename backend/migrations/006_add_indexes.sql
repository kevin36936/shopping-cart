create index idx_carts_user_id on carts(user_id);
create index idx_cart_items_cart_id on cart_items(cart_id);
create index idx_orders_user_id on orders(user_id);
create index idx_order_items_order_id on order_items(order_id);