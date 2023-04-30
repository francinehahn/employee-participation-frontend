import Head from 'next/head'
import { Footer } from '../components/footer/footer'
import { Header } from '../components/header/header'
import nookies from "nookies"
import homeChart from "../images/home-chart.jpg"
import donutChart from "../images/donut-chart.png"
import barChart from "../images/bar-chart.png"
import styles from "../styles/home.module.scss"
import Image from 'next/image'


export default function Home({token}) {
  let isLoggedIn
  token.token? isLoggedIn = true : isLoggedIn = false

  return (
    <div>
      <Head>
        <title>Home | Employee Participation</title>
        <meta name="description" content="O melhor site de avaliação de funcionários"/>
        <meta name="keywords" content="participação dos funcionários, escala de participação, avaliação de funcionários"/>
        <link rel="icon" href="/icon.png" />
      </Head>

      <Header isLoggedIn={isLoggedIn}/>

      <div className={styles.container}>
        <section>
          <div>
            <h2>A Employee Participation ajuda a sua empresa a analisar a performance de seus funcionários.</h2>
            <p>Aqui você pode cadastrar todos os projetos que já foram completados em sua empresa e todos os seus funcionários.</p>
          </div>
          <Image src={homeChart} alt="Imagem de um gráfico de barras" priority/>
        </section>

        <section>
          <div>
            <h2>Você pode adicionar todos funcionários que colaboraram em cada projeto e a sua respectiva participação.</h2>
            <p>Para cada projeto, os dados podem ser visualizados tanto na forma de gráfico de rosca, como na forma de gráfico de barras.</p>
          </div>
          <Image src={donutChart} alt="Imagem de um gráfico de rosca"/>
        </section>

        <section>
          <div>
            <h2>Você também pode acompanhar os dados de cada funcionário.</h2>
            <p>Além de visualizar o desempenho de cada colaborador em cada projeto, é possível identificar a média de participação de cada um.</p>
          </div>

          <Image src={barChart} alt="Imagem de um gráfico de barras"/>
        </section>
      </div>

      <Footer/>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const token = nookies.get(ctx)

  return {
      props: {token}
  }
}
