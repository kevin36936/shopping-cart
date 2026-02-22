create table if not exists products(
            id int primary key,
            title text not null,
            price numeric(10, 2) not null,
            image text default 'no-image.png'
        );