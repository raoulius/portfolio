// Icons live in /public/stackIcons (new ones from Devicon, MIT licensed).
// Keys are stored in projects.stack, so never rename an existing key.
type StackIcon = { label: string; src: string; mono?: boolean } // mono: black logo, inverted in dark mode

export const STACK_GROUPS: Record<string, Record<string, StackIcon>> = {
    Languages: {
        javascript: { label: 'JavaScript', src: '/stackIcons/javascript.png' },
        typescript: { label: 'TypeScript', src: '/stackIcons/typescript.svg' },
        python: { label: 'Python', src: '/stackIcons/python.png' },
        java: { label: 'Java', src: '/stackIcons/java.svg' },
        kotlin: { label: 'Kotlin', src: '/stackIcons/kotlin.svg' },
        go: { label: 'Go', src: '/stackIcons/go.svg' },
        rust: { label: 'Rust', src: '/stackIcons/rust.svg', mono: true },
        c: { label: 'C', src: '/stackIcons/c.svg' },
        cplusplus: { label: 'C++', src: '/stackIcons/cplusplus.svg' },
        csharp: { label: 'C#', src: '/stackIcons/csharp.svg' },
        php: { label: 'PHP', src: '/stackIcons/php.svg' },
        ruby: { label: 'Ruby', src: '/stackIcons/ruby.svg' },
        swift: { label: 'Swift', src: '/stackIcons/swift.svg' },
        dart: { label: 'Dart', src: '/stackIcons/dart.svg' },
    },
    Frontend: {
        react: { label: 'React', src: '/stackIcons/react.svg' },
        nextjs: { label: 'Next.js', src: '/stackIcons/nextjs.svg', mono: true },
        vuejs: { label: 'Vue', src: '/stackIcons/vuejs.svg' },
        nuxtjs: { label: 'Nuxt', src: '/stackIcons/nuxtjs.svg' },
        angular: { label: 'Angular', src: '/stackIcons/angular.svg' },
        svelte: { label: 'Svelte', src: '/stackIcons/svelte.svg' },
        tailwindcss: { label: 'Tailwind CSS', src: '/stackIcons/tailwindcss.svg' },
        flutter: { label: 'Flutter', src: '/stackIcons/flutter.svg' },
    },
    Backend: {
        nodejs: { label: 'Node.js', src: '/stackIcons/nodejs.svg' },
        express: { label: 'Express', src: '/stackIcons/express.svg', mono: true },
        nestjs: { label: 'NestJS', src: '/stackIcons/nestjs.svg' },
        laravel: { label: 'Laravel', src: '/stackIcons/laravel.png' },
        django: { label: 'Django', src: '/stackIcons/django.svg', mono: true },
        flask: { label: 'Flask', src: '/stackIcons/flask.svg', mono: true },
        fastapi: { label: 'FastAPI', src: '/stackIcons/fastapi.svg' },
        spring: { label: 'Spring', src: '/stackIcons/spring.svg' },
        rails: { label: 'Rails', src: '/stackIcons/rails.svg' },
        dotnetcore: { label: '.NET', src: '/stackIcons/dotnetcore.svg' },
        graphql: { label: 'GraphQL', src: '/stackIcons/graphql.svg' },
    },
    Databases: {
        mysql: { label: 'MySQL', src: '/stackIcons/mysql.png' },
        postgres: { label: 'PostgreSQL', src: '/stackIcons/postgres.png' },
        mongodb: { label: 'MongoDB', src: '/stackIcons/mongodb.svg' },
        redis: { label: 'Redis', src: '/stackIcons/redis.svg' },
        sqlite: { label: 'SQLite', src: '/stackIcons/sqlite.svg' },
        firebase: { label: 'Firebase', src: '/stackIcons/firebase.svg' },
        supabase: { label: 'Supabase', src: '/stackIcons/supabase.svg' },
    },
    Infrastructure: {
        docker: { label: 'Docker', src: '/stackIcons/docker.svg' },
        kubernetes: { label: 'Kubernetes', src: '/stackIcons/kubernetes.svg' },
        aws: { label: 'AWS', src: '/stackIcons/amazonwebservices.svg' },
    },
}

export const STACK_ICONS: Record<string, StackIcon> = Object.assign({}, ...Object.values(STACK_GROUPS))
