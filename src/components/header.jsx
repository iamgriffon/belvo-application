import Link from "next/link"


export function Header({pageName}) {
  return (
    <h2>
      <Link href='/'>Home </Link>  | {pageName}
    </h2>
  )
}