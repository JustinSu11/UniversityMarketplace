import styles from './page.module.css';
import Link from 'next/link';


const Home = () => {
    return (
        <div>
            <header>
                <nav><Link href="/" className={styles.websiteTitle}>Campus Exchange</Link></nav>
            </header>
        </div>
    )
}

export default Home;