import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiLink from "@mui/material/Link";
import Cookies from 'js-cookie';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import logo from 'components/client/assets/images/logo-ct-dark.png';
import ArgonAvatar from 'components/ArgonAvatar';

import ReorderIcon from '@mui/icons-material/Reorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { jwtDecode } from 'jwt-decode';
import AccountService from 'services/AccountServices';
import HomeService from 'services/HomeServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return children
    ? React.cloneElement(children, {
      elevation: trigger ? 6 : 0,
      style: {
        backgroundColor: trigger ? '#fff' : 'transparent',
        boxShadow: trigger ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
        transition: 'all 0.3s ease',
      },
    })
    : null;
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function Header(props) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [author, setAuthor] = React.useState('');
  const user = Cookies.get('user');
  var position = false;
  if (user === null) position = false;
  else
    try {
      const token = jwtDecode(user);
      if (token.scope !== 'USER')
        position = true;
    } catch (error) {
      position = false;
      console.error(error);
    }

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await AccountService.getAuthor();
        const cateResp = await HomeService.getCategoryHeader();
        setCategories(cateResp.data);
        setAuthor(resp.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);


  return (
    <>
      <ArgonBox height='110px' sx={{ borderBottom: '1px solid #d2d2d2' }}>
        <CssBaseline />
        <ElevationScroll {...props}>
          <AppBar >
            <Toolbar>
              <ArgonBox display="flex" justifyContent="space-between" height="110px" mx={16} alignItems="center" width="100%">
                {/* Logo Section */}
                {position ? (
                  <MuiLink href='/dashboard'>
                    <ArgonBox display="flex" alignItems="center">
                      <ArgonAvatar src={logo} alt="Avatar" variant="rounded" size="lg" p={3} />
                      <ArgonTypography variant="h5" ml={2}>HasagiFashion</ArgonTypography>
                    </ArgonBox>
                  </MuiLink>
                ) : (
                  <ArgonBox display="flex" alignItems="center">
                    <ArgonAvatar src={logo} alt="Avatar" variant="rounded" size="lg" p={3} />
                    <ArgonTypography variant="h5" ml={2}>HasagiFashion</ArgonTypography>
                  </ArgonBox>
                )}

                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems='center'
                  height='110px'
                  mx={6}
                  sx={{
                    flexGrow: 1,
                    display: { xs: 'none', sm: 'flex' } // Hidden on extra small screens
                  }}
                >
                  <MuiLink href="/" sx={{ paddingRight: 3 }}>
                    <ArgonTypography variant="h5">TRANG CHỦ</ArgonTypography>
                  </MuiLink>

                  <MuiLink href="/Shop" sx={{ paddingRight: 3 }}>
                    <ArgonTypography variant="h5">SẢN PHẨM</ArgonTypography>
                  </MuiLink>

                  <MuiLink href="/new" sx={{ paddingRight: 3 }}>
                    <ArgonTypography variant="h5">Liên Hệ</ArgonTypography>
                  </MuiLink>

                  <MuiLink href="/ao-thun" sx={{ paddingRight: 3 }}>
                    <ArgonTypography variant="h5">Giới Thiệu</ArgonTypography>
                  </MuiLink>

                  {/* Icons with Hover */}
                  <ArgonBox
                    display="flex"
                    px={2} height={110}
                    alignItems="center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ cursor: 'pointer' }}>
                    <ReorderIcon sx={{ fontSize: 30 }} />
                    <ExpandMoreIcon sx={{ fontSize: 30 }} />
                    {isHovering && (
                      <ArgonBox
                        sx={{
                          position: 'absolute',
                          boxShadow: '0px 4px 20px rgb(0, 0, 0, 0.2)',
                          borderTop: '2px solid red',
                          top: '85%',
                          left: 0,
                          p: 2,
                        }}
                        width='100%'
                        bgColor='secondary'
                        variant='gradient'
                      >
                        <ArgonBox
                          display="grid"
                          gridTemplateColumns="repeat(5, 1fr)" // 5 cột
                          gap={2} // Khoảng cách giữa các ô
                        >
                          {categories.map((cate, index) => (
                            <ArgonBox
                              key={index}
                              p={2}
                              color="white"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <MuiLink href={`/${cate.name}`} underline="hover">
                                <ArgonTypography>{cate.name}</ArgonTypography>
                              </MuiLink>
                            </ArgonBox>
                          ))}
                        </ArgonBox>
                      </ArgonBox>
                    )}

                  </ArgonBox>
                </ArgonBox>

                <ArgonBox display='flex' justifyContent='space-between' alignItems='center' >

                  <ArgonBox>
                    {user == null ? (
                      <MuiLink href='/authentication/sign-in' sx={{ marginRight: 1 }}>
                        <FontAwesomeIcon icon={faUser} />
                      </MuiLink>
                    ) : (
                      <ArgonBox display='flex' justifyContent='space-evenly' alignItems='center'>
                        <ArgonAvatar src={author.avatar !== '' ? author.avatar : "https://bit.ly/3I3pbe6"} alt="Avatar" size="md" sx={{ marginRight: 1 }} bgColor='light' />
                        <ArgonTypography variant="inherit">xin chào {author.username}</ArgonTypography>
                      </ArgonBox>
                    )}
                  </ArgonBox>
                  <ArgonBox>
                    <FontAwesomeIcon icon={faCartArrowDown} />
                  </ArgonBox>

                  
                </ArgonBox>
              </ArgonBox>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        <Toolbar />
      </ArgonBox>
    </>
  );
}
