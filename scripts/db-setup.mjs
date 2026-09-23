// Creates tables and seeds the projects that used to be hardcoded.
// Safe to re-run: schema is idempotent and seeding only happens on an empty table.
// Usage: npm run db:setup
import { readFileSync } from 'node:fs';
import pg from 'pg';

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));

const { rows } = await client.query('select count(*)::int as n from projects');
if (rows[0].n === 0) {
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
    ];
    for (const [i, [title, description, image, link, stack]] of seed.entries()) {
        await client.query(
            'insert into projects (title, description, image_url, link_url, stack, sort_order) values ($1,$2,$3,$4,$5,$6)',
            [title, description, image, link, stack, i],
        );
    }
    console.log(`seeded ${seed.length} projects`);
}
await client.end();
console.log('database ready');
