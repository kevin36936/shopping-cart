create table if not exists carts (
    id serial primary key,
    user_id integer not null references users(id) on delete cascade,
    created_at timestamp default now()
);

create table if not exists cart_items (
    id serial primary key,
    cart_id integer not null references carts(id) on delete cascade,
    product_id integer not null references products(id) on delete cascade,
    quantity integer not null check (quantity > 0),
    created_at timestamp default now(),
    updated_at timestamp default now(),
    unique(cart_id, product_id)
);