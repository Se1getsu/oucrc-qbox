import { AppBar, Box, Button, Link, Toolbar } from '@material-ui/core';
import { useRouter } from 'next/router';
import { deleteSession } from '../lib/posts';
import { killCookie } from '../lib/util';
import styles from '../styles/Home.module.css';

export default function Header({ sid }) {
  const router = useRouter();
  const handleLogout = async () => {
    killCookie('sid');
    deleteSession(sid);
    router.reload();
  };

  return (
    <div style={{ textAlign: 'right' }}>
      <AppBar className={styles.appbar} position="fixed">
        <Toolbar variant="dense">
          <Button
            color="inherit"
            style={
              router.pathname == '/'
                ? {
                    borderBottom: '2px solid',
                    borderRadius: '0',
                  }
                : {}
            }
            onClick={() => {
              router.push('/');
            }}
          >
            質問する
          </Button>
          <Button
            color="inherit"
            style={
              router.pathname in { '/answer': 0, '/login': 0 }
                ? {
                    borderBottom: '2px solid',
                    borderRadius: '0',
                  }
                : {}
            }
            onClick={() => {
              router.push('/answer');
            }}
          >
            回答する
          </Button>

          {sid && (
            <Box justifyContent="flex-end" style={{ flexGrow: '1' }}>
              <Link color="inherit" onClick={handleLogout}>
                ログアウトする
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
