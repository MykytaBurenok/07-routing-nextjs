import Link from "next/link";

export default function Default() {
  return (
    <nav aria-label="Notes filters">
      <ul>
        <li>
          <Link href="/notes/filter/all">All notes</Link>
        </li>
        <li>
          <Link href="/notes/filter/todo">Todo</Link>
        </li>
        <li>
          <Link href="/notes/filter/work">Work</Link>
        </li>
        <li>
          <Link href="/notes/filter/personal">Personal</Link>
        </li>
        <li>
          <Link href="/notes/filter/meeting">Meeting</Link>
        </li>
        <li>
          <Link href="/notes/filter/shopping">Shopping</Link>
        </li>
      </ul>
    </nav>
  );
}
