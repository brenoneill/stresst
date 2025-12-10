import { signIn } from "@/auth";
import { Button } from "./components/inputs/Button";
import { ScrollHeader } from "./components/ScrollHeader";

/**
 * Landing/info page shown to unauthenticated users.
 * Middleware handles redirecting authenticated users to /dashboard.
 */
export default async function Home() {
  return (
    <div className="relative min-h-screen bg-gh-canvas">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gh-canvas-subtle via-gh-canvas to-[#010409]" />

      {/* Decorative grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#30363d 1px, transparent 1px), linear-gradient(90deg, #30363d 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scroll-triggered Header */}
      <ScrollHeader>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" variant="primary">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Log in with GitHub
          </Button>
        </form>
      </ScrollHeader>

      {/* Main content */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gh-border bg-gh-canvas-subtle px-4 py-1.5 text-sm text-gh-text-muted">
            <span className="text-lg">🔥</span>
            Insurance against vibe coding
          </div>
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Are you a{" "}
            <span className="text-gh-danger-fg underline decoration-wavy decoration-gh-danger decoration-4 underline-offset-4">Vibe</span> Coder{" "}
            <br className="hidden md:block" />
            or a{" "}
            <span className="text-gh-success-fg underline decoration-wavy decoration-gh-success decoration-4 underline-offset-4">Jive</span> Coder?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gh-text-muted">
            AI can write code, but can you debug it? stresst introduces realistic bugs into real
            codebases to test if developers truly understand what they&apos;re shipping.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <Button type="submit" variant="primary" size="lg">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Get Started
            </Button>
          </form>
        </section>

        {/* What It Is Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gh-border bg-gh-canvas-subtle">
              <svg className="h-5 w-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">What is stresst?</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <span className="text-xl">🤖</span> AI-Powered Bug Generation
              </h4>
              <p className="text-sm leading-relaxed text-gh-text-muted">
                Uses Claude AI to introduce subtle, realistic bugs that developers actually make — off-by-one
                errors, null pointer issues, async/await mistakes, logic inversions, and more.
              </p>
            </div>
            <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <span className="text-xl">📊</span> Configurable Difficulty
              </h4>
              <p className="text-sm leading-relaxed text-gh-text-muted">
                Choose your stress level: Low (1-2 bugs), Medium (2-3 bugs), or High (3-5 devious bugs).
                Optionally focus on specific areas like async/await or null handling.
              </p>
            </div>
            <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <span className="text-xl">🔔</span> Realistic Bug Reports
              </h4>
              <p className="text-sm leading-relaxed text-gh-text-muted">
                Receive user-friendly symptom descriptions like &quot;The posts are showing up blank&quot; or
                &quot;The app crashes when I select an item&quot; — just like real production issues.
              </p>
            </div>
            <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
              <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <span className="text-xl">📋</span> Share & Collaborate
              </h4>
              <p className="text-sm leading-relaxed text-gh-text-muted">
                Copy bug reports to share with colleagues via email or Slack. Perfect for team training
                sessions, code reviews, or interview scenarios.
              </p>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gh-border bg-gh-canvas-subtle">
              <svg className="h-5 w-5 text-gh-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Why I Built This</h3>
          </div>
          <div className="rounded-xl border border-gh-border bg-gradient-to-br from-gh-canvas-subtle to-gh-canvas p-8">
            <p className="mb-4 text-lg leading-relaxed text-gh-text-muted">
              AI code generation is everywhere — Cursor, Copilot, ChatGPT. Developers are shipping code faster
              than ever. But here&apos;s the uncomfortable question:{" "}
              <span className="font-semibold text-white">
                do they actually understand what they&apos;re shipping?
              </span>
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gh-text-muted">
              When AI-generated code breaks (and it will), can your team debug it? Or are they just prompting
              until the errors go away?
            </p>
            <p className="text-lg leading-relaxed text-gh-text-muted">
              <span className="font-semibold text-white">stresst</span> provides a challenging and engaging way
              for developers to learn how to fix bugs and diagnose code. It&apos;s essential for anyone using
              code-gen tools — because when things go wrong,{" "}
              <span className="font-semibold text-gh-danger-fg">
                it&apos;s imperative to be able to get things back on track.
              </span>
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gh-border bg-gh-canvas-subtle">
              <svg className="h-5 w-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">How It Works</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { step: "1", title: "Connect", desc: "Sign in with GitHub to access your repositories" },
              { step: "2", title: "Select", desc: "Choose a repo, branch, and commit to stress" },
              { step: "3", title: "Stress", desc: "AI introduces realistic bugs — share & debug!" },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border border-gh-border bg-gh-canvas-subtle p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gh-success font-mono text-lg font-bold text-white">
                  {item.step}
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-gh-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Choose Your Codebase Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gh-border bg-gh-canvas-subtle">
              <svg className="h-5 w-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Choose Your Codebase</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gh-border-muted">
                <svg className="h-6 w-6 text-gh-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Your Own Codebase</h4>
              <p className="mb-4 text-sm leading-relaxed text-gh-text-muted">
                Use any repository you have access to. Great for testing your team&apos;s familiarity with
                your actual production code.
              </p>
              <div className="flex items-center gap-2 text-xs text-gh-text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Requires write access to create branches
              </div>
            </div>
            <div className="relative rounded-xl border-2 border-gh-success bg-gradient-to-br from-gh-success/10 to-gh-canvas-subtle p-6">
              <div className="absolute -top-3 right-4 rounded-full bg-gh-success px-3 py-1 text-xs font-semibold text-white">
                Recommended
              </div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gh-success/20">
                <svg className="h-6 w-6 text-gh-success-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Our Practice Codebases</h4>
              <p className="mb-4 text-sm leading-relaxed text-gh-text-muted">
                Fork one of our public &quot;dummy&quot; repositories designed specifically for practice.
                No risk to your real code, and they&apos;re structured to be great learning material.
              </p>
              <div className="flex items-center gap-2 text-xs text-gh-success-fg">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                One-click fork available after sign in
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gh-border bg-gh-canvas-subtle">
              <svg className="h-5 w-5 text-gh-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Getting Started</h3>
          </div>
          <div className="rounded-xl border border-gh-border bg-gh-canvas-subtle p-6">
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-white">Prerequisites</h4>
              <ul className="space-y-2 text-sm text-gh-text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-gh-success-fg">✓</span> Node.js 18+
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gh-success-fg">✓</span> A GitHub account
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gh-success-fg">✓</span> An Anthropic API key
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-white">Quick Setup</h4>
              <div className="space-y-3">
                <div className="rounded-lg bg-gh-canvas p-4">
                  <code className="text-sm text-gh-text-muted">
                    <span className="text-gh-text-muted">$</span>{" "}
                    <span className="text-gh-accent">git clone</span> https://github.com/brenoneill/stresst.git
                  </code>
                </div>
                <div className="rounded-lg bg-gh-canvas p-4">
                  <code className="text-sm text-gh-text-muted">
                    <span className="text-gh-text-muted">$</span> <span className="text-gh-accent">cd</span>{" "}
                    stresst && <span className="text-gh-accent">npm install</span>
                  </code>
                </div>
                <div className="rounded-lg bg-gh-canvas p-4">
                  <code className="text-sm text-gh-text-muted">
                    <span className="text-gh-text-muted">$</span> <span className="text-gh-accent">npm run</span>{" "}
                    dev
                  </code>
                </div>
              </div>
            </div>
            <p className="text-sm text-gh-text-muted">
              See the{" "}
              <a
                href="https://github.com/brenoneill/stresst#readme"
                className="text-gh-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                README
              </a>{" "}
              for full environment setup including GitHub OAuth and Anthropic API configuration.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <div className="rounded-xl border border-gh-border bg-gradient-to-r from-gh-danger/10 via-gh-canvas-subtle to-gh-success/10 p-10">
            <h3 className="mb-4 text-2xl font-bold text-white">Ready to stress test your skills?</h3>
            <p className="mx-auto mb-6 max-w-lg text-gh-text-muted">
              Connect your GitHub account and start building real debugging muscle today.
            </p>
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/dashboard" });
              }}
            >
              <Button type="submit" variant="primary" size="lg">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Start Stressing
              </Button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-gh-border pt-8 text-center text-sm text-gh-text-muted">
          <p>Built with ❤️ for developer education</p>
        </footer>
      </main>
    </div>
  );
}
