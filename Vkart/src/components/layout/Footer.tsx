import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-ink text-bone">
      <div className="grain absolute inset-0 opacity-30 mix-blend-overlay" />
      <div className="container-page relative grid gap-12 py-20 md:grid-cols-[1.5fr,1fr,1fr,1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-bone/5">
              <Image
                src="/logo-mark.svg"
                alt="Vkart"
                fill
                sizes="40px"
                className="object-cover opacity-90"
              />
            </span>
            <span className="font-serif text-3xl font-bold tracking-tight">
              Vkart
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-bone/60">
            Beautifully sourced groceries and daily necessities, delivered to
            your door from farms and makers we trust.
          </p>
          <form className="mt-8 flex max-w-sm gap-2">
            <input
              type="email"
              placeholder="Email for new arrivals"
              aria-label="Email"
              className="min-w-0 flex-1 rounded-full border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:border-bone focus:outline-none"
            />
            <button
              type="button"
              className="rounded-full bg-clay px-5 py-3 text-sm font-semibold text-bone transition hover:bg-clay-soft"
            >
              Join
            </button>
          </form>
          <p className="mt-3 text-xs text-bone/40">
            We respect your inbox. Unsubscribe anytime.
          </p>
        </div>

        <FooterColumn
          title="Shop"
          links={[
            { label: "All products", href: "/shop" },
            { label: "Fresh produce", href: "/shop?category=fresh-produce" },
            { label: "Dairy & eggs", href: "/shop?category=dairy-eggs" },
            { label: "Pantry", href: "/shop?collection=pantry-staples" },
            { label: "Bakery", href: "/shop?category=bakery" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { label: "Our story", href: "/about" },
            { label: "Sourcing", href: "/about#sourcing" },
            { label: "Sustainability", href: "/about#sustainability" },
            { label: "Careers", href: "/about#careers" },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { label: "Help center", href: "/about#help" },
            { label: "Shipping & returns", href: "/about#shipping" },
            { label: "Contact", href: "/about#contact" },
            { label: "Privacy", href: "/about#privacy" },
          ]}
        />
      </div>

      <div className="relative border-t border-bone/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-bone/50">
            © {new Date().getFullYear()} Vkart. Crafted with care.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-bone/50">
              We accept:{" "}
              <span className="font-mono uppercase tracking-widest text-bone/80">
                Visa · Mastercard · Amex · Apple Pay
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/50">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-bone/80 transition hover:text-clay"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
