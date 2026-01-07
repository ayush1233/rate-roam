-- Schema for Store Rating Platform

create extension if not exists "pgcrypto";

create table roles (
  id serial primary key,
  name varchar(32) not null unique
);

insert into roles (name) values ('admin'), ('user'), ('owner')
  on conflict (name) do nothing;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name varchar(60) not null,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  address varchar(400),
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role_id int not null references roles(id) on delete cascade,
  unique (user_id, role_id)
);

create index if not exists idx_user_roles_user on user_roles(user_id);
create index if not exists idx_user_roles_role on user_roles(role_id);

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  email varchar(255),
  address varchar(400) not null,
  owner_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_stores_name on stores using gin (to_tsvector('simple', name));
create index if not exists idx_stores_address on stores using gin (to_tsvector('simple', address));

create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ratings
  add constraint if not exists unique_user_store unique (user_id, store_id);

create index if not exists idx_ratings_store on ratings(store_id);
create index if not exists idx_ratings_user on ratings(user_id);
