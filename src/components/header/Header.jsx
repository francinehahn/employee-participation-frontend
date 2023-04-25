import Link from "next/link"

export function Header () {
    return (
        <header>
            <Link href={"/"}>Página inicial</Link>
            {<Link href={"/dashboard"}>Dashboard</Link>}
            <Link href={"/login"}>Login/Signup</Link>
        </header>
    )
}