import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import clsx from "clsx";
import styles from "./index.module.css";

const features = [
  {
    title: "Reactive Core",
    description:
      "Signals, effects, and computed values with built-in infinite-loop protection. UI updates automatically when data changes.",
  },
  {
    title: "Data-First Queries",
    description:
      "Chainable, type-safe query builder over reactive or static data sources. No eval, no injection — predicates are TypeScript functions.",
  },
  {
    title: "Secure SQLite",
    description:
      "Parameterised queries only, WAL mode, identifier validation, and tamper-evident hash-chained audit logging baked in.",
  },
  {
    title: "AI Auto-Fix",
    description:
      "AI-powered code analysis running inside a true V8 isolate sandbox via isolated-vm — not the deprecated vm2.",
  },
  {
    title: "React UI",
    description:
      "XSS-safe Grid and Form components wired directly to Signals. Automatic re-renders, zero boilerplate.",
  },
  {
    title: "Security First",
    description:
      "Hash-chained audit logs, Zod validation at all boundaries, path traversal prevention, and OWASP-aligned design.",
  },
];

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className={clsx("col col--4", styles.feature)}>
      <div className="padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout description={siteConfig.tagline}>
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/guide/introduction">
              Get Started →
            </Link>
            <Link
              className="button button--outline button--secondary button--lg"
              href="https://github.com/coderchef26/azmara-platform"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((f) => (
                <Feature key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
