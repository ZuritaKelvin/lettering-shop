create schema if not exists public;
create schema if not exists kit;

alter default privileges
revoke
execute on functions
from
  public;

revoke all on schema public
from
  public;

revoke all PRIVILEGES on database "postgres"
from
  "anon";

revoke all PRIVILEGES on schema "public"
from
  "anon";

revoke all PRIVILEGES on schema "storage"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "public"
from
  "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "storage"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "public"
from
  "anon";

revoke all PRIVILEGES on all TABLES in schema "storage"
from
  "anon";

-- We remove all default privileges from public schema on functions to
--   prevent public access to them by default
alter default privileges in schema public
revoke
execute on functions
from
  anon,
  authenticated;

-- we allow the authenticated role to execute functions in the public schema
grant usage on schema public to authenticated;

-- we allow the service_role role to execute functions in the public schema
grant usage on schema public to service_role;

create type public.payment_status as ENUM('pending', 'succeeded', 'failed');
create type public.colors as ENUM('red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'gray');

/*
 * -------------------------------------------------------
 * Section: Accounts
 * We create the schema for the accounts. Accounts are the top level entity in the Supabase MakerKit. They can be team or personal accounts.
 * -------------------------------------------------------
 */
-- Accounts table
create table if not exists
  public.accounts (
    id uuid unique not null default extensions.uuid_generate_v4 (),
    user_id uuid references auth.users on delete cascade not null default auth.uid (),
    name varchar(255) not null,
    picture_url varchar(1000),
    email text unique not null,
    phone text,
    address text,
    city text,
    postal_code text,
    country text default 'Spain',
    is_personal_account boolean default true not null,
    updated_at timestamp with time zone,
    created_at timestamp with time zone,
    created_by uuid references auth.users,
    updated_by uuid references auth.users,
    public_data jsonb default '{}'::jsonb not null,
    unique(user_id),
    primary key (id)
  );

-- Enable RLS on the accounts table
alter table "public"."accounts" enable row level security;

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.accounts
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table public.accounts to authenticated,
service_role;

create index if not exists ix_accounts_is_personal_account on public.accounts (is_personal_account);


-- RLS on the accounts table
-- UPDATE(accounts):
-- Team owners can update their accounts
create policy accounts_select on public.accounts
for select
  to authenticated using (
    (
      select
        auth.uid ()
    ) = user_id
  );
create policy accounts_self_update on public.accounts
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = user_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );

-- Function "public.is_account_owner"
-- Function to check if a user is the primary owner of an account
create
or replace function public.is_account_owner (account_id uuid) returns boolean
set
  search_path = '' as $$
    select
        exists(
            select
                1
            from
                public.accounts
            where
                id = is_account_owner.account_id
                and user_id = auth.uid());
$$ language sql;

grant
execute on function public.is_account_owner (uuid) to authenticated,
service_role;


-- create a trigger to update the account email when the primary owner email is updated
create
or replace function kit.handle_update_user_email () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
    update
        public.accounts
    set
        email = new.email
    where
        user_id = new.id;

    return new;

end;

$$;

-- trigger the function every time a user email is updated only if the user is the primary owner of the account and
-- the account is personal account
create trigger "on_auth_user_updated"
after
update of email on auth.users for each row
execute procedure kit.handle_update_user_email ();

/**
 * -------------------------------------------------------
 * Section: Products
 * We create the schema for the products.
 * -------------------------------------------------------
 */
create table products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    price numeric not null,
    delivery_date date not null
);
alter table products enable row level security;

create policy "Users can view" on public.products
    for select to authenticated using (true);
create policy "Admin can manage products" on public.products
    for all to service_role using (true) with check (true);

/**
 * -------------------------------------------------------
 * Section: Product Colors
 * We create the schema for the product colors.
 * -------------------------------------------------------
 */
create table product_colors (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references products(id) not null,
    color public.colors not null,
    image_url text,
    stock int not null
);
alter table product_colors enable row level security;

create policy "Users can view product colors" on public.product_colors
    for select to authenticated using (stock > 0);
create policy "Admin can manage product colors" on public.product_colors
    for all to service_role using (true) with check (true);

/**
 * -------------------------------------------------------
 * Section: Cart Items
 * We create the schema for the cart items. Cart items are temporary items before checkout.
 * -------------------------------------------------------
 */
create table cart_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    product_color_id uuid references product_colors(id) on delete cascade not null,
    quantity int not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, product_color_id)
);

alter table cart_items enable row level security;

create policy "Users can view their own cart" on public.cart_items
    for select to authenticated using (user_id = auth.uid());
    
create policy "Users can insert to their own cart" on public.cart_items
    for insert to authenticated with check (user_id = auth.uid());
    
create policy "Users can update their own cart" on public.cart_items
    for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
    
create policy "Users can delete from their own cart" on public.cart_items
    for delete to authenticated using (user_id = auth.uid());

-- Index for faster queries
create index idx_cart_items_user_id on cart_items(user_id);

-- Trigger to update updated_at
create or replace function update_cart_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger cart_items_updated_at
    before update on cart_items
    for each row
    execute function update_cart_updated_at();

/**
 * -------------------------------------------------------
 * Section: Orders
 * We create the schema for the subscription items. Subscription items are the items in a subscription.
 * For example, a subscription might have a subscription item with the product ID 'prod_123' and the variant ID 'var_123'.
 * -------------------------------------------------------
 */
create table if not exists
  public.orders (
    id text not null primary key,
    account_id uuid references public.accounts (id) on delete cascade not null,
    status public.payment_status not null,
    total_amount numeric not null,
    currency varchar(3) not null,
    shipping_address text,
    city text,
    postal_code text,
    country text default 'Spain'
  );

comment on table public.orders is 'The one-time orders for an account';

comment on column public.orders.account_id is 'The account the order is for';

comment on column public.orders.total_amount is 'The total amount for the order';

comment on column public.orders.currency is 'The currency for the order';

comment on column public.orders.status is 'The status of the order';

comment on column public.orders.shipping_address is 'The shipping address for the order';

comment on column public.orders.city is 'The city for the order';

comment on column public.orders.postal_code is 'The postal code for the order';

comment on column public.orders.country is 'The country for the order';
alter table public.orders enable row level security;
create policy "Users can view" on public.orders
    for select to authenticated using (account_id = auth.uid());
create policy "Users can update" on public.orders
    for update to authenticated using (account_id = auth.uid()) with check (account_id = auth.uid());
create policy "Admin can manage orders" on public.orders
    for all to service_role using (true) with check (true);
/**
 * -------------------------------------------------------
 * Section: Order Items
 * We create the schema for the order items. Order items are the items in an order.
 * -------------------------------------------------------
 */
create table if not exists
  public.order_items (
    id text not null primary key,
    order_id text references public.orders (id) on delete cascade not null,
    product_id text not null,
    price_amount numeric,
    quantity integer not null default 1,
    created_at timestamptz not null default current_timestamp,
    updated_at timestamptz not null default current_timestamp,
    unique (order_id, product_id)
  );

comment on table public.order_items is 'The items in an order';

comment on column public.order_items.order_id is 'The order the item is for';

comment on column public.order_items.order_id is 'The order the item is for';

comment on column public.order_items.product_id is 'The product ID for the item';


comment on column public.order_items.price_amount is 'The price amount for the item';

comment on column public.order_items.quantity is 'The quantity of the item';

comment on column public.order_items.created_at is 'The creation date of the item';

comment on column public.order_items.updated_at is 'The last update date of the item';

-- Revoke all access to order_items table for authenticated users and service_role
revoke all on public.order_items
from
  authenticated,
  service_role;

-- Open up relevant access to order_items table for authenticated users and service_role
grant
select
  on table public.order_items to authenticated,
  service_role;

grant insert, update, delete on table public.order_items to service_role;

-- Indexes on the order_items table
create index ix_order_items_order_id on public.order_items (order_id);

-- RLS
alter table public.order_items enable row level security;

-- SELECT(order_items):
-- Users can read order items on an order they are a member of
create policy order_items_read_self on public.order_items for
select
  to authenticated using (
    exists (
      select
        1
      from
        public.orders
      where
        id = order_id
        and (
          account_id = (
            select
              auth.uid ()
          )
        )
    )
  );


-- Function "public.upsert_order"
-- Insert or update an order and its items when receiving a webhook from the billing provider
create
or replace function public.upsert_order (
  target_account_id uuid,
  target_customer_id varchar(255),
  target_order_id text,
  status public.payment_status,
  total_amount numeric,
  currency varchar(3),
  line_items jsonb
) returns public.orders
set
  search_path = '' as $$
declare
    new_order public.orders;
begin
    insert into public.orders(
        account_id,
        id,
        status,
        total_amount,
        currency)
    values (
        target_account_id,
        target_order_id,
        status,
        total_amount,
        currency)
on conflict (
    id)
    do update set
        status = excluded.status,
        total_amount = excluded.total_amount,
        currency = excluded.currency
    returning
        * into new_order;

    -- Upsert order items and delete ones that are not in the line_items array
    with item_data as (
        select
            (line_item ->> 'id')::text as line_item_id,
            (line_item ->> 'product_id')::text as prod_id,
            (line_item ->> 'price_amount')::numeric as price_amt,
            (line_item ->> 'quantity')::integer as qty
        from
            jsonb_array_elements(line_items) as line_item
    ),
    line_item_ids as (
        select line_item_id from item_data
    ),
    deleted_items as (
        delete from
            public.order_items
        where
            public.order_items.order_id = new_order.id
            and public.order_items.id not in (select line_item_id from line_item_ids)
        returning *
    )
    insert into public.order_items(
        id,
        order_id,
        product_id,
        price_amount,
        quantity)
    select
        line_item_id,
        target_order_id,
        prod_id,
        price_amt,
        qty
    from
        item_data
    on conflict (id)
        do update set
            price_amount = excluded.price_amount,
            product_id = excluded.product_id,
            quantity = excluded.quantity;

    return new_order;

end;

$$ language plpgsql;

grant
execute on function public.upsert_order (
  uuid,
  varchar,
  text,
  public.payment_status,
  numeric,
  varchar,
  jsonb
) to service_role;

/**
 * -------------------------------------------------------
 * Section: Notifications
 * We create the schema for the notifications. Notifications are the notifications for an account.
 * -------------------------------------------------------
 */
create type public.notification_channel as enum('in_app', 'email');

create type public.notification_type as enum('info', 'warning', 'error');

create table if not exists
  public.notifications (
    id bigint generated always as identity primary key,
    account_id uuid not null references public.accounts (id) on delete cascade,
    type public.notification_type not null default 'info',
    body varchar(5000) not null,
    link varchar(255),
    channel public.notification_channel not null default 'in_app',
    dismissed boolean not null default false,
    expires_at timestamptz default (now() + interval '1 month'),
    created_at timestamptz not null default now()
  );

comment on table notifications is 'The notifications for an account';

comment on column notifications.account_id is 'The account the notification is for (null for system messages)';

comment on column notifications.type is 'The type of the notification';

comment on column notifications.body is 'The body of the notification';

comment on column notifications.link is 'The link for the notification';

comment on column notifications.channel is 'The channel for the notification';

comment on column notifications.dismissed is 'Whether the notification has been dismissed';

comment on column notifications.expires_at is 'The expiry date for the notification';

comment on column notifications.created_at is 'The creation date for the notification';

-- Revoke all access to notifications table for authenticated users and service_role
revoke all on public.notifications
from
  authenticated,
  service_role;

-- Open up relevant access to notifications table for authenticated users and service_role
grant
select
,
update on table public.notifications to authenticated,
service_role;

grant insert on table public.notifications to service_role;

-- enable realtime
alter publication supabase_realtime
add table public.notifications;

-- Indexes
-- Indexes on the notifications table
-- index for selecting notifications for an account that are not dismissed and not expired
create index idx_notifications_account_dismissed on notifications (account_id, dismissed, expires_at);

-- RLS
alter table public.notifications enable row level security;

-- SELECT(notifications):
-- Users can read notifications on an account they are a member of
create policy notifications_read_self on public.notifications for
select
  to authenticated using (
    account_id = (
      select
        auth.uid ()
    )
  );

-- UPDATE(notifications):
-- Users can set notifications to read on an account they are a member of
create policy notifications_update_self on public.notifications
for update
  to authenticated using (
    account_id = (
      select
        auth.uid ()
    )
  );

-- Function "kit.update_notification_dismissed_status"
-- Make sure the only updatable field is the dismissed status and nothing else
create
or replace function kit.update_notification_dismissed_status () returns trigger
set
  search_path to '' as $$
begin
    old.dismissed := new.dismissed;

    if (new is distinct from old) then
         raise exception 'UPDATE of columns other than "dismissed" is forbidden';
    end if;

    return old;
end;
$$ language plpgsql;

-- add trigger when updating a notification to update the dismissed status
create trigger update_notification_dismissed_status before
update on public.notifications for each row
execute procedure kit.update_notification_dismissed_status ();

-- Function "kit.setup_new_user"
-- Setup a new user account after user creation
create
or replace function kit.setup_new_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
declare
    user_name text;
    picture_url text;
begin
    if new.raw_user_meta_data ->> 'name' is not null then
        user_name := new.raw_user_meta_data ->> 'name';

    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);

    end if;

    if user_name is null then
        user_name := '';

    end if;

    if new.raw_user_meta_data ->> 'avatar_url' is not null then
        picture_url := new.raw_user_meta_data ->> 'avatar_url';
    else
        picture_url := null;
    end if;

    insert into public.accounts(
        id,
        user_id,
        name,
        is_personal_account,
        picture_url,
        email)
    values (
        new.id,
        new.id,
        user_name,
        true,
        picture_url,
        new.email);

    return new;

end;

$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure kit.setup_new_user ();


--
-- VIEW "user_account_workspace":
-- we create a view to load the general app data for the authenticated
-- user which includes the user accounts and memberships
create or replace view
  public.user_account_workspace
with
  (security_invoker = true) as
select
  accounts.id as id,
  accounts.name as name,
  accounts.picture_url as picture_url
from
  public.accounts
where
  user_id = (select auth.uid ())
  and accounts.is_personal_account = true
limit
  1;

grant
select
  on public.user_account_workspace to authenticated,
  service_role;

--


-- Audit
create schema if not exists audit;
-- Trigger para actualizar los campos en operaciones CRUD
CREATE OR REPLACE FUNCTION audit.update_audit_columns() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    NEW.created_at := NOW();
    NEW.created_by := auth.uid();
    NEW.updated_at := NOW();
    NEW.updated_by := auth.uid();
  ELSIF (TG_OP = 'UPDATE') THEN
    NEW.updated_at := NOW();
    NEW.updated_by := auth.uid();
  ELSIF (TG_OP = 'DELETE') THEN
    -- NEW.is_deleted := true;
    -- NEW.deleted_at := NOW();
    -- NEW.deleted_by := auth.uid();
    EXECUTE format('UPDATE %I SET is_deleted = true, deleted_at = now(), deleted_by = auth.uid() WHERE id = ''%s''', TG_table_name, OLD.id);
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit.add_audit_columns(table_name text)
    returns void
    volatile
    security definer
    set search_path = ''
    language plpgsql
as $$
declare
    statement_row text = format('
      ALTER TABLE %s ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                                   ADD COLUMN IF NOT EXISTS created_by UUID,
                                   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                                   ADD COLUMN IF NOT EXISTS updated_by UUID,
                                   ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false NOT NULL,
                                   ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
                                   ADD COLUMN IF NOT EXISTS deleted_by UUID',
        $1
    );
BEGIN
  EXECUTE statement_row;
END;
$$;
create or replace function audit.primary_key_columns(entity_oid oid)
    returns text[]
    stable
    security definer
    set search_path = ''
    language sql
as $$
    -- Looks up the names of a table's primary key columns
    select
        coalesce(
            array_agg(pa.attname::text order by pa.attnum),
            array[]::text[]
        ) column_names
    from
        pg_index pi
        join pg_attribute pa
            on pi.indrelid = pa.attrelid
            and pa.attnum = any(pi.indkey)

    where
        indrelid = $1
        and indisprimary
$$;

create or replace function audit.enable_tracking(regclass)
    returns void
    volatile
    security definer
    set search_path = ''
    language plpgsql
as $$
declare
    statement_row text = format('
        create trigger audit_i_u_d
            before insert or update or delete
            on %s
            for each row
            execute function audit.update_audit_columns();',
        $1
    );
    pkey_cols text[] = audit.primary_key_columns($1);
begin
    PERFORM audit.add_audit_columns($1::text);
    if pkey_cols = array[]::text[] then
        raise exception 'Table % can not be audited because it has no primary key', $1;
    end if;
        if not exists(select 1 from pg_trigger where tgrelid = $1 and tgname = 'audit_i_u_d') then
        execute statement_row;
    end if;
end;
$$;
