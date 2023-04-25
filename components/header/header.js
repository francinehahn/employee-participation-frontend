import { useState } from "react"
import Link from "next/link"
import styles from "./header.module.scss"
import Image from "next/image"
import logo from "../../images/logo.png"
import {destroyCookie} from "nookies"


export function Header(props) {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const handleLogout = () => {
        destroyCookie(null, "token")   
    }

    const nav = () => {
        return (
            <>
                <Link href={"/"}>Página inicial</Link>
                {props.isLoggedIn && <Link href={"/projects"}>Projetos</Link>}
                {props.isLoggedIn && <Link href={"/employees"}>Funcionários</Link>}
                {props.isLoggedIn && <Link href={"/registrations"}>Cadastros</Link>}
                {!props.isLoggedIn && <Link href={"/login"}>Entrar</Link>}
                {!props.isLoggedIn && <Link href={"/signup"}>Cadastrar</Link>}
                {props.isLoggedIn && <Link href={"/"} onClick={handleLogout}>Sair</Link>}
            </>
        )
    }

    return (
        <header className={styles.container}>
            <Link href="/">
                <Image src={logo} alt="Logo da empresa"/>
            </Link>
            
            <nav>
                {nav()}
            </nav>

            <div onClick={() => setShowMobileMenu(true)}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {showMobileMenu && (
                <div>
                    <button onClick={() => setShowMobileMenu(false)}>X</button>
                    <nav>{nav()}</nav>
                </div>
            )}
        </header>
    )
}