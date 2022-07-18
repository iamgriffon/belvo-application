import Link from "next/link";
import { useBelvo } from "../context/belvo";

export function Header({ pageName }) {
  const { activeLink } = useBelvo();
  return (
    <>
      <h2>
        <Link href='/'>🏠 </Link>  | {pageName}
      </h2>
      {activeLink.length >= 1 ?
        (<p>Your current link is {activeLink}</p>)
        : (<p>You don't have a valid link, please go to the Home to get one</p>)}
    </>

  )
}