-- Backfill missing sales rows for existing auth users.
-- This prevents edge functions relying on getUserSale() from returning 401.
with existing_sales as (
  select count(*)::int as sales_count
  from public.sales
),
missing_users as (
  select
    u.id as user_id,
    coalesce(
      u.raw_user_meta_data ->> 'first_name',
      u.raw_user_meta_data -> 'custom_claims' ->> 'first_name',
      'Pending'
    ) as first_name,
    coalesce(
      u.raw_user_meta_data ->> 'last_name',
      u.raw_user_meta_data -> 'custom_claims' ->> 'last_name',
      'Pending'
    ) as last_name,
    coalesce(u.email, concat(u.id::text, '@pending.local')) as email,
    row_number() over (order by u.created_at, u.id) as rn
  from auth.users u
  left join public.sales s on s.user_id = u.id
  where s.user_id is null
)
insert into public.sales (
  first_name,
  last_name,
  email,
  user_id,
  administrator,
  disabled
)
select
  m.first_name,
  m.last_name,
  m.email,
  m.user_id,
  case
    when (select sales_count from existing_sales) = 0 and m.rn = 1 then true
    else false
  end as administrator,
  false as disabled
from missing_users m;
