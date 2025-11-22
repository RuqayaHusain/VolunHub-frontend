import { Link } from 'react-router';
import styles from './Landing.module.css';

const Landing = () => {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Empower Your Community</h1>
        <p className={styles.subtitle}>
          Join the Volunteer Hub and discover meaningful opportunities to make a real impact
        </p>

        <div className={styles.actions}>
          <Link to='/sign-up' className={styles.signUpBtn}>Get Started</Link>
          <Link to='/sign-in' className={styles.signInBtn}>Sign In</Link>
        </div>
      </div>
    </main>
  );
};

export default Landing;

