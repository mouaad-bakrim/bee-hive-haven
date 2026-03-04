# CMS Setup (Supabase + Admin)

## Database

The project uses the existing **`posts`** table (see `supabase/migrations/`). No new migration is required for the CMS flow. The schema already has:

- `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `cover_url`, `status`, `published_at`, `views`, `meta_title`, `meta_description`, `featured`, `created_at`, `updated_at`
- RLS: public can **SELECT** only `status = 'published'`; admins (via `user_roles.role = 'admin'`) can **INSERT/UPDATE/DELETE**
- `increment_post_view(p_post_id)` RPC to safely increment views (SECURITY DEFINER, no service role in frontend)

## Environment (Vite)

In `.env`:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<your-local-anon-key>
```

Or use `VITE_SUPABASE_PUBLISHABLE_KEY` instead of `VITE_SUPABASE_ANON_KEY`. For hosted Supabase, use your project URL and anon key.

## Commands

```bash
# Create a new migration (only if you change schema)
npx supabase migration new your_migration_name

# Apply migrations and reset DB (local)
npx supabase db reset

# Start local Supabase (if not already running)
npx supabase start

# Run the app
npm run dev
```

## Flow

1. **Admin** (`/admin/posts`): create/edit articles; **Enregistrer brouillon** → `status = 'draft'`, `published_at = null`; **Publier** → `status = 'published'`, `published_at = now()`.
2. **Public**: home, category, and article pages load **published** articles from Supabase. Viewing an article calls `increment_post_view(id)` once per visit.
3. **Realtime**: The public site subscribes to `postgres_changes` on the `posts` table. New or updated articles appear automatically without refresh. Enable Realtime for the table: Supabase Dashboard → Database → Replication → add `posts` to the `supabase_realtime` publication (or run `ALTER PUBLICATION supabase_realtime ADD TABLE posts;`).
