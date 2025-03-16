import Link from "next/link";

export default function Breadcrumbs({ path }) {
  return (
    <nav id="breadcrumb">
      <ol>
        {path.map((segment, index) => (
          <li key={index}>
            {segment.url ? (
              <Link href={segment.url}>{segment.name}</Link>
            ) : (
              segment.name
            )}
            {index < path.length - 1 && " > "}
          </li>
        ))}
      </ol>
    </nav>
  );
}
