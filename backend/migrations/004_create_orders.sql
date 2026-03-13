create table orders (
    id serial primary key,
    user_id integer references users(id) on delete set null,
    total_amount decimal(10, 2) not null,
    status varchar(50) not null default 'paid',
    stripe_payment_intent_id varchar(255),
    created_at timestamp not null default now()
);