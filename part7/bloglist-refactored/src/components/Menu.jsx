import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '@mui/material';

function Menu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ gap: '15px', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              sx={!user && { flexGrow: 1 }}
            >
              Blogs app
            </Typography>

            {user ? (
              <>
                <Link
                  component={RouterLink}
                  to="/blogs"
                  color="inherit"
                  underline="none"
                >
                  <Typography>blogs</Typography>
                </Link>
                <Link
                  component={RouterLink}
                  to="/users"
                  color="inherit"
                  underline="none"
                >
                  <Typography>users</Typography>
                </Link>
                <Typography sx={{ flexGrow: 1 }}>
                  {user.name} logged in
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  logout
                </Button>
              </>
            ) : (
              <Button color="inherit">Login</Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default Menu;
