import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-[#fbfaf7]">
      <section className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
              Our story
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
              Better groceries,
              <br />
              <em className="text-moss">delivered beautifully.</em>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft/80">
              Vkart was started on a simple belief: the everyday things in your
              pantry and on your table deserve to be as good as the things you
              save for special occasions. So we built a different kind of store
              — sourcing from small farms and makers, packing every order by
              hand, and delivering fresh to your door in hours, not days.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300488e?w=1200&q=80"
              alt="Fresh produce at Vkart"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container-page pb-20 md:pb-28">
        <div className="grid gap-6 md:grid-cols-3">
          <ValueCard
            number="01"
            title="Source with integrity"
            body="Every farm and maker we partner with is visited in person. We pay above-market rates, support regenerative practices, and pay small growers weekly — never net-90."
          />
          <ValueCard
            number="02"
            title="Pack with care"
            body="Orders are packed to order by our team — never sitting in a warehouse for weeks. Cold-chain insulated, beautifully presented, and delivered fast."
          />
          <ValueCard
            number="03"
            title="Stand behind it"
            body="If anything arrives less than perfect, we replace it or refund it — no questions. Free returns within 30 days, every time."
          />
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="container-page grid grid-cols-2 gap-8 py-16 md:grid-cols-4 md:py-24">
          <Stat value="180+" label="Local farms" />
          <Stat value="2,400" label="Products" />
          <Stat value="50k" label="Happy customers" />
          <Stat value="28 min" label="Avg. delivery" />
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="rounded-[2rem] bg-bone-warm/60 p-12 text-center md:p-20">
          <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
            Ready to shop?
          </h2>
          <p className="mt-4 text-ink-soft/80">
            Browse our full catalog — fresh produce, pantry, home essentials and
            more.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-medium text-bone transition hover:bg-moss-deep"
          >
            Browse the shop
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-bone-warm/50 p-8">
      <p className="font-serif text-3xl text-stone">{number}</p>
      <h3 className="mt-4 font-serif text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-ink-soft/75">{body}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-5xl md:text-6xl">{value}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/60">
        {label}
      </p>
    </div>
  );
}
