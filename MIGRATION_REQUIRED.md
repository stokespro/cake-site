# Database Migration — status

**Nothing needs to be run.** This file previously contained a SQL block to paste
into the Supabase SQL editor. Do not use it; it is preserved in git history
only. Two reasons:

1. **It could not run.** It used `CREATE POLICY IF NOT EXISTS`, which Postgres
   does not support (`ERROR: 42601: syntax error at or near "NOT"`). The whole
   script aborts on the first policy.
2. **It was already applied,** and the one thing it would have added that was
   missing has since been handled (see below).

This database is the **live CRM**, not a website sandbox — ~1,900 customers plus
orders, commissions, `finance_bills`, `compliance_log`, inventory and users.
Treat schema changes accordingly.

## Current state (verified against the database)

| Item | Status |
|---|---|
| `customers.show_on_map` column | exists |
| `strain_batches` table + indexes | exists |
| `public_dispensary_locations` view | exists, `security_invoker = on` |
| RLS | enabled on all public tables |
| `strains` public read policy | exists — anon reads work |
| `strain_batches` public read policy | exists |
| `sample_requests` anon insert / service_role read | exists |
| `subscribers` anon insert / service_role read | exists |
| `customers` policies | scoped to the `cake_teddy` / `cake_mint` CRM roles — **leave alone** |

The old script's `CREATE POLICY "Service role can read customers"` was **not**
applied, deliberately: `customers` already has scoped CRM policies and did not
need another.

## How Find Us gets its data

`public_dispensary_locations` is `security_invoker = on`, so it runs with the
caller's permissions. The `anon` role has no privilege on the underlying
`customers` table, so **an anon read of the view fails** with
`permission denied for table customers` regardless of any `GRANT` on the view.

Rather than flip the view to security-definer — which would publish every
opted-in dispensary's name, address, phone, email and OMMA licence to anyone
holding the public anon key — `app/(site)/find-us/page.tsx` reads it with the
**service role** from a Server Component. No public exposure, no schema change.

A `GRANT SELECT ... TO anon` was briefly applied and then revoked once that
approach was chosen; the anon surface is unchanged from before.

## Why the map is empty

`show_on_map` defaults to `false` and **0 of ~1,900 customers are opted in**, so
`/find-us` renders its "New Partnerships Coming Soon" state. To populate it:

```sql
UPDATE customers SET show_on_map = true WHERE id = '<customer-id>';
```

Each row you flip publishes that dispensary's name, address, city, phone, email
and OMMA licence on the public site. That is the intent of the flag — just be
deliberate about which rows get it.

## Why /labs is empty

`strain_batches` has no rows yet. Lab results appear as batches are inserted
with `thc_percent` / `cbd_percent` / `coa_url`.
