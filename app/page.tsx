import Image from "next/image";
import { Suspense } from "react";
import { Room3DScene } from "../components/Room3DScene";
import { RoomExperienceClient } from "../components/RoomExperienceClient";
import { ScrollReveal } from "../components/ScrollReveal";
import { ParallaxImage } from "../components/ParallaxImage";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=80",
  living: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
  bedroom: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  minimal: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  detail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* ─── Nav ─── */}
      <nav className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <span className="text-[13px] font-medium uppercase tracking-[0.3em]">
            Megan&apos;s Home
          </span>
          <div className="hidden items-center gap-8 text-[13px] font-light text-[var(--muted)] md:flex">
            <a href="#about" className="link-underline transition hover:text-[var(--fg)]">
              About
            </a>
            <a href="#services" className="link-underline transition hover:text-[var(--fg)]">
              Services
            </a>
            <a href="#gallery" className="link-underline transition hover:text-[var(--fg)]">
              Gallery
            </a>
            <a href="#design" className="link-underline transition hover:text-[var(--fg)]">
              Design Tool
            </a>
          </div>
          <a
            href="#design"
            className="btn-outline rounded-full border border-[var(--fg)] px-5 py-2 text-[12px] font-light uppercase tracking-wider"
          >
            Get Started
          </a>
        </div>
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative h-screen w-full overflow-hidden">
          <Image
            src={IMAGES.hero}
            alt="Beautiful modern interior"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 sm:px-10 md:pb-28">
            <div className="mx-auto w-full max-w-7xl">
              <ScrollReveal delay={200}>
                <p className="mb-4 text-[11px] font-light uppercase tracking-[0.3em] text-white/70">
                  AI-Powered Interior Design
                </p>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <h1 className="max-w-3xl text-[clamp(2.8rem,7vw,6rem)] font-extralight leading-[0.95] tracking-tight text-white">
                  The future of
                  <br />
                  interior design
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={600}>
                <p className="mt-6 max-w-md text-[14px] font-light leading-relaxed text-white/70">
                  Upload photos of any room and watch AI transform them into
                  editable, physics-correct 3D models — instantly.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={800}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#design"
                    className="btn-primary rounded-full bg-white px-8 py-3.5 text-[13px] font-light text-black"
                  >
                    Start Designing &rarr;
                  </a>
                  <a
                    href="#about"
                    className="rounded-full border border-white/30 px-8 py-3.5 text-[13px] font-light text-white transition hover:bg-white/10"
                  >
                    Learn More
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/40 p-1">
              <div className="h-2 w-0.5 animate-bounce rounded-full bg-white/70" />
            </div>
          </div>
        </section>

        {/* ─── About ─── */}
        <section id="about" className="py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid gap-16 md:grid-cols-2 md:items-center">
              <ScrollReveal direction="left">
                <ParallaxImage
                  src={IMAGES.living}
                  alt="Modern living room"
                  className="relative aspect-[4/5] w-full rounded-lg"
                />
              </ScrollReveal>

              <ScrollReveal direction="right" delay={200}>
                <div className="space-y-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
                    About Us
                  </p>
                  <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-extralight leading-tight tracking-tight">
                    Reimagining how
                    <br />
                    you design spaces
                  </h2>
                  <p className="max-w-md text-[15px] font-light leading-relaxed text-[var(--muted)]">
                    We combine artificial intelligence with deep design
                    sensibility to help you visualize, plan, and perfect any
                    room. From a single photograph, our platform builds a
                    precise 3D replica you can redesign with confidence.
                  </p>
                  <p className="max-w-md text-[15px] font-light leading-relaxed text-[var(--muted)]">
                    Every wall, doorway, and piece of furniture is mapped in
                    true 1:1 scale — no guesswork, no clipping, no compromises.
                  </p>
                  <a
                    href="#services"
                    className="link-underline inline-block text-[13px] font-light uppercase tracking-wider"
                  >
                    Our Services
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="border-y border-[var(--border)] bg-[var(--cream)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
            {[
              { num: "10K+", label: "Rooms Designed" },
              { num: "1:1", label: "True Scale" },
              { num: "<5s", label: "Processing Time" },
              { num: "99%", label: "Accuracy Rate" },
            ].map((s) => (
              <ScrollReveal key={s.label} delay={100} className="px-6 py-12 text-center sm:px-10 md:py-16">
                <p className="text-[clamp(2rem,4vw,3.5rem)] font-extralight tracking-tight">
                  {s.num}
                </p>
                <p className="mt-2 text-[12px] font-light uppercase tracking-wider text-[var(--muted)]">
                  {s.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ─── Services ─── */}
        <section id="services" className="py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <ScrollReveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
                What We Do
              </p>
              <h2 className="mb-16 max-w-lg text-[clamp(1.8rem,3.5vw,3rem)] font-extralight leading-tight tracking-tight">
                From photo to physics-aware
                <br />
                3D in seconds
              </h2>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2">
              <ServiceCard
                image={IMAGES.bedroom}
                number="01"
                title="Photo to 3D Replica"
                description="Upload a single photo — we reconstruct walls, doors, and furniture in 1:1 scale, ready for editing in real time."
                delay={0}
              />
              <ServiceCard
                image={IMAGES.kitchen}
                number="02"
                title="AI Furniture Detection"
                description="Beds, sofas, desks, and more are automatically identified, sized, and placed with smart defaults you can adjust."
                delay={150}
              />
              <ServiceCard
                image={IMAGES.minimal}
                number="03"
                title="Rule-Aware 3D Editor"
                description="Drag and drop furniture while real-time physics rules prevent wall clipping, overlaps, and blocked doorways."
                delay={0}
              />
              <ServiceCard
                image={IMAGES.office}
                number="04"
                title="Auto-Fix Layouts"
                description="One click snaps everything into place — wall-huggers align, rugs center, overlapping items separate cleanly."
                delay={150}
              />
            </div>
          </div>
        </section>

        {/* ─── Gallery ─── */}
        <section id="gallery" className="border-t border-[var(--border)] bg-[var(--cream)] py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <ScrollReveal>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
                Gallery
              </p>
              <h2 className="mb-16 text-[clamp(1.8rem,3.5vw,3rem)] font-extralight leading-tight tracking-tight">
                Spaces we&apos;ve transformed
              </h2>
            </ScrollReveal>

            <div className="grid gap-4 md:grid-cols-3">
              <ScrollReveal delay={0} className="md:row-span-2">
                <div className="img-zoom relative aspect-[3/4] w-full overflow-hidden rounded-lg">
                  <Image
                    src={IMAGES.living}
                    alt="Living room design"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={IMAGES.bedroom}
                    alt="Bedroom design"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={IMAGES.kitchen}
                    alt="Kitchen design"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={IMAGES.detail}
                    alt="Interior detail"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="img-zoom relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={IMAGES.minimal}
                    alt="Minimal interior"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── Design Tool (3D) ─── */}
        <section id="design" className="border-t border-[var(--border)] py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--cream)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
              <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <ScrollReveal className="max-w-2xl">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
                    Design Tool
                  </p>
                  <h2 className="text-[clamp(1.8rem,3.5vw,3rem)] font-extralight leading-tight tracking-tight">
                    Your 3D room, built
                    <br />
                    for quick iteration.
                  </h2>
                  <p className="mt-5 max-w-xl text-[14px] font-light leading-relaxed text-[var(--muted)]">
                    Drop in up to five photos of the same room and move straight
                    into a spacious, editable 3D workspace with clearer controls
                    and a larger live preview.
                  </p>
                </ScrollReveal>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Upload photos",
                    "Explore 3D",
                    "Refine layout",
                  ].map((step) => (
                    <span
                      key={step}
                      className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="order-2 xl:order-1">
                  <ScrollReveal delay={120}>
                    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.05)] sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--muted)]">
                            3D Model Workspace
                          </p>
                          <p className="mt-1 text-sm font-light text-[var(--fg)]">
                            Upload, inspect, and tune the room model in one place.
                          </p>
                        </div>
                        <a
                          href="#design"
                          className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)] transition hover:bg-[var(--cream)]"
                        >
                          Focus Mode
                        </a>
                      </div>
                      <RoomExperienceClient />
                    </div>
                  </ScrollReveal>
                </div>

                <div className="order-1 xl:order-2">
                  <ScrollReveal delay={180}>
                    <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white p-2 shadow-[0_16px_45px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="ml-2 text-[11px] font-light text-[var(--muted)]">
                          Live 3D Preview
                        </span>
                      </div>
                      <Suspense
                        fallback={
                          <div className="min-h-[420px] w-full animate-pulse bg-[var(--cream)] md:min-h-[520px]" />
                        }
                      >
                        <div className="min-h-[420px] w-full md:min-h-[520px]">
                          <Room3DScene />
                        </div>
                      </Suspense>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              <ScrollReveal delay={240}>
                <p className="mt-6 text-[11px] font-light text-[var(--muted)]">
                  We never train on your personal imagery. Your data stays yours.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden">
          <Image
            src={IMAGES.detail}
            alt="Interior background"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-36">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-extralight leading-tight tracking-tight text-white">
                  Ready to bring your
                  <br />
                  dream room to life?
                </h2>
                <p className="mt-4 text-[14px] font-light text-white/60">
                  Start free. Design three full projects. Upgrade when you need
                  more.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <a
                    href="#design"
                    className="btn-primary rounded-full bg-white px-8 py-3.5 text-[13px] font-light text-black"
                  >
                    Get Started Free &rarr;
                  </a>
                  <a
                    href="#"
                    className="rounded-full border border-white/30 px-8 py-3.5 text-[13px] font-light text-white transition hover:bg-white/10"
                  >
                    Schedule a Demo
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-[var(--border)] bg-[var(--fg)] text-white/60">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
            <div className="grid gap-12 md:grid-cols-[1fr_1fr_1fr_1fr]">
              <div className="space-y-4 md:col-span-1">
                <span className="text-[13px] font-medium uppercase tracking-[0.3em] text-white">
                  Megan&apos;s Home
                </span>
                <p className="text-[13px] font-light leading-relaxed">
                  AI-powered interior design that turns photos into editable 3D
                  room models.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Product
                </p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <a href="#services" className="transition hover:text-white">Features</a>
                  <a href="#design" className="transition hover:text-white">Design Tool</a>
                  <a href="#gallery" className="transition hover:text-white">Gallery</a>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Company
                </p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <a href="#about" className="transition hover:text-white">About</a>
                  <a href="#" className="transition hover:text-white">Careers</a>
                  <a href="#" className="transition hover:text-white">Contact</a>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Legal
                </p>
                <div className="flex flex-col gap-2 text-[13px] font-light">
                  <a href="#" className="transition hover:text-white">Privacy</a>
                  <a href="#" className="transition hover:text-white">Terms</a>
                </div>
              </div>
            </div>

            <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[11px] font-light sm:flex-row sm:items-center sm:justify-between">
              <p>&copy; {new Date().getFullYear()} Megan&apos;s Home. All rights reserved.</p>
              <p>Designed with care in California.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function ServiceCard(props: {
  image: string;
  number: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <ScrollReveal delay={props.delay}>
      <div className="group cursor-pointer">
        <div className="img-zoom relative aspect-[16/10] w-full overflow-hidden rounded-lg">
          <Image
            src={props.image}
            alt={props.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-[11px] font-light text-[var(--muted)]">
            {props.number}
          </p>
          <h3 className="text-[17px] font-light tracking-tight group-hover:underline group-hover:underline-offset-4">
            {props.title}
          </h3>
          <p className="max-w-sm text-[13px] font-light leading-relaxed text-[var(--muted)]">
            {props.description}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}
