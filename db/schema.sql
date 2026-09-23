-- Uploaded binaries (resume, project images). Stored in Postgres so the site
-- needs no separate object storage. ponytail: fine for a handful of MB-sized
-- files; move to S3/R2 + a url column if uploads grow large or numerous.
create table if not exists files (
    id           uuid primary key default gen_random_uuid(),
    name         text        not null,
    content_type text        not null,
    data         bytea       not null,
    created_at   timestamptz not null default now()
);

create table if not exists projects (
    id          serial primary key,
    title       text        not null,
    description text        not null default '',
    image_url   text,                               -- '/files/<uuid>' or a static '/project/...' path
    link_url    text,
    stack       text[]      not null default '{}',  -- keys of STACK_ICONS in lib/stack.ts
    sort_order  int         not null default 0,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table if not exists posts (
    id           serial primary key,
    slug         text        not null unique,
    title        text        not null,
    excerpt      text        not null default '',
    body         text        not null default '',   -- markdown
    published    boolean     not null default false,
    published_at date        not null default current_date,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);
create index if not exists posts_published_idx on posts (published, published_at desc);

-- Singleton values, e.g. resume_file_id.
create table if not exists settings (
    key   text primary key,
    value text not null
);
