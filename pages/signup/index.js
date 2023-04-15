import Head from "next/head"
import { useState } from "react"
import { Header } from "../../components/header"
import nookies from "nookies"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { LoadingButton } from "../../components/loadingButton"
import Router from "next/router"
import styles from "../../styles/signup.module.scss"


export default function Signup ({token}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [repeatPasswordError, setRepeatPasswordError] = useState("")
    const [axiosError, setAxiosError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const handleSignup = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setNameError("")
        setEmailError("")
        setPasswordError("")
        setAxiosError("")

        const body = {
            userName: name,
            email,
            password
        }

        if (name === "" || name.length < 10 || !name.includes(" ")) {
            setNameError("Informe o seu nome completo.")
            setIsLoading(false)
        }
        if (email === "") {
            setEmailError("Informe o seu email.")
            setIsLoading(false)
        }
        if (password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres.")
            setIsLoading(false)
        }
        if (password !== repeatPassword) {
            setRepeatPasswordError("A senha deve ser a mesma que a digitada anteriormente.")
            setIsLoading(false)
        }

        if (name.length >= 8 && name.includes(" ") && password.length >= 8 && password === repeatPassword) {
            axios.post(`${baseUrl}users/signup`, body)
            .then(() => {
                alert("Usuário criado com sucesso!")
                Router.push("/login")
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
                <title>Signup | Employee Participation</title>
                <meta name="description" content="O melhor site de avaliação de funcionários"/>
                <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <h2>Crie uma nova conta</h2>

                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name">Nome completo</label>
                        <input type={'text'} placeholder="Maria Santos" name="name" value={name} onChange={e => setName(e.target.value)}/>
                        <p>{nameError}</p>
                    </div>

                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input type={'email'} placeholder="maria.santos@gmail.com" name="email"value={email} onChange={e => setEmail(e.target.value)}/>
                        <p>{emailError}</p>
                    </div>

                    <div>
                        <label htmlFor="password">Senha</label>
                        <input type={'password'} placeholder="********" name="password" value={password} onChange={e => setPassword(e.target.value)}/>
                        <p>{passwordError}</p>
                    </div>

                    <div>
                        <label htmlFor="repeatPassword">Repita a senha</label>
                        <input type={'password'} placeholder="********" name="repeatPassword" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
                        <p>{repeatPasswordError}</p>
                    </div>

                    <p>{axiosError}</p>

                    <button>{isLoading? <LoadingButton/> : 'Cadastrar'}</button>
                </form>
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