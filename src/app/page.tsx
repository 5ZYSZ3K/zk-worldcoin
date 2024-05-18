import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-start py-20">
      <h1 className="text-6xl font-extrabold tracking-tight text-black">
        World ID Test
      </h1>
      <div className="mt-80 flex justify-center gap-8">
        <PageLink href="/memory-wall">Memory Wall</PageLink>
        <PageLink href="/vote">Vote</PageLink>
        <PageLink href="/agh">AGH Blockchain Election</PageLink>
      </div>
    </div>
  );
}

function PageLink(props: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={props.href}
      className="rounded-lg border-2 border-black bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black"
    >
      {props.children}
    </Link>
  );
}
