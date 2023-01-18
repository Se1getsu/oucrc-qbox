import styles from '../styles/Home.module.css';
import { useSpring, animated } from '@react-spring/web';
import Header from './Header';

export default function Layout({ children, sid }) {
  const topColor = '#007602';
  const btmColor = '#2ee8a1';

  //背景アニメーション
  const sptyle = useSpring({
    loop: true,
    config: {
      duration: 5000,
    },
    from: {
      background: `linear-gradient(to bottom, ${topColor}, ${btmColor} 100%, ${btmColor})`,
    },
    to: [
      {
        background: `linear-gradient(to bottom, ${btmColor}, ${btmColor} 0%, ${topColor})`,
      },
      {
        background: `linear-gradient(to bottom, ${btmColor}, ${topColor} 100%, ${topColor})`,
        config: { duration: 0 },
      },
      {
        background: `linear-gradient(to bottom, ${topColor}, ${topColor} 0%, ${btmColor})`,
      },
    ],
  });

  return (
    <animated.div style={sptyle}>
      <div className={styles.container}>
        <Header sid={sid} />

        <div className={styles.pagebg}>
          <main className={styles.main}>{children}</main>
        </div>

        <footer className={styles.footer}>
          <a
            href="https://oucrc.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            © 2022 OUCRC All rights reserved
          </a>
        </footer>
      </div>
    </animated.div>
  );
}
