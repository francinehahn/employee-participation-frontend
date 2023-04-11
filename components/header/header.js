import Link from "next/link"

export function Header() {
    return (
        <header>
            <nav>
                <Link href={"/"}>Página inicial</Link>
                <Link href={"/dashboard"}>Dashboard</Link>
                <Link href={"/login"}>Login/Signup</Link>
            </nav>
        </header>
    )
}