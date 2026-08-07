import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      nav={{
        ...baseOptions().nav,
        title: (
          <>
            <svg className="size-5" viewBox="0 0 180 180" aria-label="Fumadocs">
              <circle
                cx="90"
                cy="90"
                r="89"
                fill="url(#fumadocs-icon-gradient)"
                stroke="var(--color-fd-primary)"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="fumadocs-icon-gradient" gradientTransform="rotate(45)">
                  <stop offset="45%" stopColor="var(--color-fd-background)" />
                  <stop offset="100%" stopColor="var(--color-fd-primary)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-medium">Fumadocs</span>
          </>
        ),
      }}
      links={[
        { text: 'Documentation', url: '/docs' },
        { text: 'Blog', url: '/blog' },
        { text: 'Showcase', url: '/showcase' },
        { text: 'Sponsors', url: 'https://fuma-nama.dev/sponsors', external: true },
      ]}
      className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)] [--color-fd-primary:var(--color-brand)]"
    >
      {children}
    </HomeLayout>
  );
}
