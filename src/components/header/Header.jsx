'use client'
import Link from "next/link"
import { useState, useEffect } from "react"

export function Header () {
    const [token, setToken] = useState("")
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem("token"))
        }
    }, [])

    return (
        <header>
            <Link href={"/"}>Página inicial</Link>
            {token && <Link href={"/dashboard"}>Dashboard</Link>}
            <Link href={"/login"}>Login/Signup</Link>
        </header>
    )
}