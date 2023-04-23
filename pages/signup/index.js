import Head from "next/head"
import { useState } from "react"
import { Header } from "../../components/header/header"
import nookies from "nookies"
import axios from "axios"
import { baseUrl } from "../../constants/baseUrl"
import { Loading } from "../../components/loading/loading"
import Router from "next/router"
import styles from "./signup.module.scss"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useForm } from "../../hooks/useForm"


export default function Signup ({token}) {
    let isLoggedIn
    token.token? isLoggedIn = true : isLoggedIn = false

    const [form, onChange] = useForm({userName: "", email: "", password: ""})
    const [repeatPassword, setRepeatPassword] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [repeatPasswordError, setRepeatPasswordError] = useState("")
    const [axiosError, setAxiosError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [inputTypePass, setInputTypePass] = useState("password")
    const [inputTypeRepeatPass, setInputTypeRepeatPass] = useState("password")

    const handleSignup = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setNameError("")
        setEmailError("")
        setPasswordError("")
        setAxiosError("")

        if (form.userName === "" || form.userName.length < 10 || !form.userName.includes(" ")) {
            setNameError("Informe o seu nome completo.")
            setIsLoading(false)
        }
        if (form.email === "") {
            setEmailError("Informe o seu email.")
            setIsLoading(false)
        }
        if (form.password.length < 8) {
            setPasswordError("A senha deve ter pelo menos 8 caracteres.")
            setIsLoading(false)
        }
        if (form.password !== repeatPassword) {
            setRepeatPasswordError("A senha deve ser a mesma que a digitada anteriormente.")
            setIsLoading(false)
        }

        if (form.userName.length >= 8 && form.userName.includes(" ") && form.password.length >= 8 && form.password === repeatPassword) {
            axios.post(`${baseUrl}users/signup`, form)
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
                <link rel="icon" href="/icon.png" />
            </Head>

            <Header isLoggedIn={isLoggedIn}/>

            <div className={styles.container}>
                <h2>Crie uma nova conta</h2>

                <form onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="userName">Nome completo</label>
                        <input type={'text'} placeholder="Maria Santos" name="userName" value={form.userName} onChange={onChange}/>
                        <p>{nameError}</p>
                    </div>

                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input type={'email'} placeholder="maria.santos@gmail.com" name="email" value={form.email} onChange={onChange}/>
                        <p>{emailError}</p>
                    </div>

                    <div>
                        <label htmlFor="password">Senha</label>
                        <span className={styles.password}>
                            <input type={inputTypePass} placeholder="********" name="password" value={form.password} onChange={onChange}/>
                            {inputTypePass === "password"? <AiOutlineEyeInvisible onClick={() => setInputTypePass("text")}/> : <AiOutlineEye onClick={() => setInputTypePass("password")}/>}
                        </span>
                        <p>{passwordError}</p>
                    </div>

                    <div>
                        <label htmlFor="repeatPassword">Repita a senha</label>
                        <span className={styles.password}>
                            <input type={inputTypeRepeatPass} placeholder="********" name="repeatPassword" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}/>
                            {inputTypeRepeatPass === "password"? <AiOutlineEyeInvisible onClick={() => setInputTypeRepeatPass("text")}/> : <AiOutlineEye onClick={() => setInputTypeRepeatPass("password")}/>}
                        </span>
                        <p>{repeatPasswordError}</p>
                    </div>

                    <p>{axiosError}</p>

                    <button>{isLoading? <Loading insideButton={true}/> : 'Cadastrar'}</button>
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