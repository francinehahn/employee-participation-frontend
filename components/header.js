import Link from "next/link"
import styles from "../styles/header.module.scss"
import Image from "next/image"
import logo from "../images/logo.png"

export function Header({isLogedIn}) {
    return (
        <header className={styles.container}>
            <Link href="/">
                <Image src={logo} alt="Logo da empresa"/>
            </Link>
            
            <nav>
                <Link href={"/"}>Página inicial</Link>
                {isLogedIn && <Link href={"/dashboard"}>Dashboard</Link>}
                <Link href={"/login"}>Entrar</Link>
                <Link href={"/signup"}>Cadastrar</Link>
            </nav>
        </header>
    )
}

export async function getServerSideProps (ctx) {
    const token = ctx.req.cookies.token
    let isLogedIn

    token? isLogedIn = true : isLogedIn = false

    return {
        props: {isLogedIn}
    }
}