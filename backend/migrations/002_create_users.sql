create table if not exists users (
    id serial primary key,
    email varchar(255) unique not null,
    password_hash text not null,
    created_at timestamptz default now()
);