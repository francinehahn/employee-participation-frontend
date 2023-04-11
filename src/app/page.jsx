import { Header } from "@/components/header/Header"


export default async function Home() {
  //se não passar revalidate, o fetch será chamado de forma estática, ou seja, apenas uma vez
  //por padrão, o cache do fetch no next é force-cache, ou seja, todo user que entrar no site e fizer a requisição, receberá a mesma resposta

  const token = ""
	if (token) {
    const response = await fetch('https://employee-participation.onrender.com/users/account', {
      cache: 'no-store',
      next: {
        revalidate: 30
      },
      headers: {
        Authorization: token
      }
    })
    const user = await response.json()
    if (!user) {
      //excluir localstorage
    }
  }
  
  return (
    <>
      <Header/>
      <h1>Home page</h1>
      {/*<pre>{JSON.stringify(user, null, 2)}</pre>*/}
    </>
  )
}
