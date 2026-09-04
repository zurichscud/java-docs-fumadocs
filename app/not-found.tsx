import Link from "next/link";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cn } from "@/lib/cn";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-16">
      <div className="flex max-w-lg flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-fd-primary">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <Link
          href="/"
          className={cn(buttonVariants({ color: "primary" }), "mt-8")}
        >
          Return to homepage
        </Link>
      </div>
    </main>
  );
}
