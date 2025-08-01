import styles from './home.module.css'; 


const Home = () => {
    return (
        <div>
            <header>
                <nav><a href="/" className={styles.websiteTitle}>Campus Exchange</a></nav>
            </header>
        </div>
    )
}

export default Home;