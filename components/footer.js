import { BsInstagram } from 'react-icons/bs'
import { BsLinkedin } from 'react-icons/bs'
import { ImFacebook2 } from 'react-icons/im'
import styles from "../styles/footer.module.scss"
import Link from 'next/link'

export function Footer() {
    return (
        <footer className={styles.container}>
            <div>
                <Link href="https://www.instagram.com/" target='_blank'><BsInstagram/></Link>
                <Link href="https://www.linkedin.com/" target='_blank'><BsLinkedin/></Link>
                <Link href="https://www.facebook.com/" target='_blank'><ImFacebook2/></Link>
            </div>

            <div>
                <p>Copyright © 2005-2023 Employee Participation LTDA</p>
                <p>CNPJ n.º 02.000.751/0006-00 / Av. do Trabalho, nº 654, Voluntários da Pátria, São Paulo/SP - CEP 01000-713</p>
            </div>
        </footer>
    )
}