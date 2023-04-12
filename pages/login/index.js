import { useState } from "react"
import axios from "axios"
import Head from "next/head"
import Router from "next/router"
import { setCookie } from "nookies"


export default function Login () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [axiosError, setAxiosError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setEmailError("")
        setPasswordError("")
        setAxiosError("")

        const body = {
            email,
            password
        }

        if (email === "") {
            setEmailError("Preencha o campo de email.")
            setIsLoading(false)
        } else if (password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres.")
            setIsLoading(false)
        } else {
            axios.post("https://employee-participation.onrender.com/users/login", body)
            .then(response => {
                setIsLoading(false)
                setCookie(undefined, 'token', response.data.token, {
                    maxAge: 60 * 60 //1 hora
                })
                Router.push("/dashboard")
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
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h2>Entre na sua conta</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>E-mail</label>
                    <input type={'email'} placeholder="maria.santos@gmail.com" value={email} onChange={e => setEmail(e.target.value)}/>
                    <p>{emailError}</p>
                </div>

                <div>
                    <label>Senha</label>
                    <input type={'password'} placeholder="********" value={password} onChange={e => setPassword(e.target.value)}/>
                    <p>{passwordError}</p>
                </div>

                <p>{axiosError}</p>
                <button>{isLoading? 'Carregando' : 'Entrar'}</button>
            </form>
        </>
    )
}