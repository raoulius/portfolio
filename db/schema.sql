-- Uploaded binaries (resume, project images). Stored in the database so the site
-- needs no separate object storage. ponytail: fine for a handful of MB-sized
-- files; move to S3/R2 + a url column if uploads grow large or numerous.
create table if not exists files (
    id           text primary key,                  -- uuid, generated in app/admin/actions.ts
    name         text    not null,
    content_type text    not null,
    data         blob    not null,
    created_at   text    not null default current_timestamp  -- UTC 'YYYY-MM-DD HH:MM:SS'
);

create table if not exists projects (
    id          integer primary key,
    title       text    not null,
    description text    not null default '',
    image_url   text,                               -- '/files/<uuid>' or a static '/project/...' path
    link_url    text,
    stack       text    not null default '[]',      -- JSON array of STACK_ICONS keys in lib/stack.ts
    sort_order  integer not null default 0,
    created_at  text    not null default current_timestamp,
    updated_at  text    not null default current_timestamp
);

create table if not exists posts (
    id           integer primary key,
    slug         text    not null unique,
    title        text    not null,
    excerpt      text    not null default '',
    body         text    not null default '',       -- markdown
    published    integer not null default 0,        -- 0/1
    published_at text    not null default current_date,  -- 'YYYY-MM-DD'
    created_at   text    not null default current_timestamp,
    updated_at   text    not null default current_timestamp
);
create index if not exists posts_published_idx on posts (published, published_at desc);

-- Singleton values, e.g. resume_file_id.
create table if not exists settings (
    key   text primary key,
    value text not null
);
