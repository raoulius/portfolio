// Creates tables and seeds the projects that used to be hardcoded.
// Safe to re-run: schema is idempotent and seeding only happens on an empty table.
// Usage: npm run db:setup (DATABASE_PATH defaults to data/portfolio.db)
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const path = process.env.DATABASE_PATH ?? 'data/portfolio.db';
mkdirSync(dirname(path), { recursive: true });
const db = new DatabaseSync(path);
db.exec(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));

// Columns added after a table already existed (create table if not exists skips them).
if (!db.prepare('pragma table_info(posts)').all().some((c) => c.name === 'cover_url')) {
    db.exec('alter table posts add column cover_url text');
}

if (db.prepare('select count(*) as n from projects').get().n === 0) {
    const seed = [
        ['Qash: Multi-Outlet POS & Restaurant Platform',
            'Multi-tenant SaaS for F&B businesses, piloting in 3 cafes. Point of sale, kitchen display, table reservations, inventory with recipe costing, HR and payroll, and a website builder for every merchant, with real-time updates over WebSockets.',
            '/project/qash-landing.webp', 'https://withqash.com', ['laravel', 'mysql']],
        ['Lokaluxe Eximindo: Export Company Site & CMS',
            "Scroll-driven landing page for an Indonesian export company (tea, plantation commodities, furniture, frozen food), with GSAP animations and a custom admin CMS so the client can edit every section's copy and images uploaded to Cloudinary.",
            '/project/lokaluxe.png', null, ['javascript', 'postgres']],
        ['Jakarta Social League: Amateur Basketball League Platform',
            "Registration and league management for Jakarta's recreational basketball league. Players and teams sign up, manage rosters and roles, pay league fees through Xendit with webhook confirmation, and get per-player stats tracked for every match.",
            '/project/jsocleague.png', null, ['laravel', 'javascript', 'postgres']],
        ['System Information with Face Recognition',
            'Freelance project with Meraki for the Senate of Law Universitas Diponegoro. Equipped with face recognition attendance taking, file status tracker, room booking tracker, and all kinds of manual work digitalized. Handled deployment as well.',
            '/project/senatfh.jpg', 'https://senatfhundip.my.id/', ['laravel', 'python', 'mysql']],
        ['Nox Topup Game Service',
            'Created a discord bot to automatically rank customers inside the discord server by how much they spent. Also created a landing page and handled SEO.',
            '/project/nox.png', 'https://noxconnection.com/', ['laravel', 'python', 'javascript', 'postgres']],
        ['MouseSnap: Multi-Monitor Cursor Hotkeys for macOS',
            'Open source menu bar app that jumps the cursor to the center of any monitor with one hotkey per display, numbered left to right like your physical layout. It clicks once on arrival so the app on the new monitor is focused right away, handles mixed resolutions and stacked arrangements, and ships as a single dependency-free Swift file of about 80 KB.',
            '/project/mousesnap.png', 'https://github.com/raoulius/mousesnap', ['swift']],
    ];
    for (const [i, [title, description, image, link, stack]] of seed.entries()) {
        db.prepare('insert into projects (title, description, image_url, link_url, stack, sort_order) values (?,?,?,?,?,?)')
            .run(title, description, image, link, JSON.stringify(stack), i);
    }
    console.log(`seeded ${seed.length} projects`);
}
db.close();
console.log(`database ready: ${path}`);
