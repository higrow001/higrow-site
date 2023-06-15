import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>Landing Page.</p>
      <Link className="text-theme-blue" href="/signin">
        Sign in
      </Link>
    </main>
  );
}
