import { useState } from "react"
import axios from "axios"
import Head from "next/head"
import Router from "next/router"
import nookies, { setCookie } from "nookies"
import styles from "./login.module.scss"
import Link from "next/link"
import { Loading } from "../../components/loading/loading"
import { Header } from "../../components/header/header"
import { baseUrl } from "../../constants/baseUrl"
import {AiOutlineEyeInvisible} from "react-icons/ai"
import {AiOutlineEye} from "react-icons/ai"
import { useForm } from "../../hooks/useForm"


export default function Login ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const [form, onChange] = useForm({email: "", password: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [axiosError, setAxiosError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [inputType, setInputType] = useState("password")

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setEmailError("")
        setPasswordError("")
        setAxiosError("")
        
        if (form.email === "") {
            setEmailError("Informe o seu email.")
            setIsLoading(false)
        }
        if (form.password === "" || form.password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres.")
            setIsLoading(false)
        }
        
        if (form.email !== "" && form.password.length >= 8) {
            axios.post(`${baseUrl}users/login`, form)
            .then(response => {
                setIsLoading(false)
                setCookie(undefined, 'token', response.data.token, {
                    maxAge: 60 * 60 //1 hora
                })
                Router.push("/projects")
            })
            .catch(error => {
                setIsLoading(false)
                setAxiosError(error.response.data)
            })
        }
    }

    return (
        <>
            <Head>
                <title>Login | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/icon.png" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <h2>Entre na sua conta</h2>

                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input type={'email'} placeholder="maria.santos@gmail.com" name="email" value={form.email} onChange={onChange}/>
                        <p>{emailError}</p>
                    </div>

                    <div>
                        <label htmlFor="password">Senha</label>
                        <span className={styles.password}>
                            <input type={inputType} placeholder="********" name="password" value={form.password} onChange={onChange}/>
                            {inputType === "password"? <AiOutlineEyeInvisible onClick={() => setInputType("text")}/> : <AiOutlineEye onClick={() => setInputType("password")}/>}
                        </span>
                        <p>{passwordError}</p>
                    </div>

                    <p>{axiosError}</p>
                    <button>{isLoading? <Loading insideButton={true}/> : 'Entrar'}</button>
                </form>

                <span className={styles.span}>
                    <p>Não possui uma conta?</p>
                    <Link href={"/signup"}>Clique aqui.</Link>
                </span>
            </div>
        </>
    )
}

export async function getServerSideProps (ctx) {
    const token = nookies.get(ctx)
  
    return {
        props: {token}
    }
}