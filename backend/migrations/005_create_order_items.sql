create table order_items (
    id serial primary key,
    order_id integer not null references orders(id) on delete cascade,
    product_id integer references products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price_at_time decimal(10, 2) not null
);