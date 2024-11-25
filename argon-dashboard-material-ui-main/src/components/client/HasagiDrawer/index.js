import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';


import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MuiLink from "@mui/material/Link";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import HomeService from 'services/HomeServices';
import { List, ListItem, ListItemAvatar } from '@mui/material';


export default function AnchorTemporaryDrawer() {

  const [items, setItems] = React.useState('');
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const getCart = async () => {
    try {
      const resp = await HomeService.getCartByAccount();
      setItems(resp.data);
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    getCart()
  }, [])

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <ArgonBox display='flex' justifyContent='space-evenly' alignItems='center' broderBottom='1px solid light'>
        <ArgonTypography variant='button2' letterSpacing='3px'>GIỎ HÀNG</ArgonTypography>
      </ArgonBox>

      {
        items.length > 0 ?
          <List>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <MuiLink href='' >
                  <ArgonAvatar src="https://bit.ly/3I3pbe6" alt="Avatar" variant="rounded" size="xl" />
                </MuiLink>
              </ListItemAvatar>

              <ArgonBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <MuiLink href=''>
                  <ArgonTypography color='sencondary'>

                  </ArgonTypography>
                </MuiLink>

                <ArgonTypography color='sencondary'>

                </ArgonTypography>
              </ArgonBox>

            </ListItem>
            <Divider />
          </List>
          :
          <ArgonBox display='flex' justifyContent='center' alignItems='center' width='100%' height='60%'>
            <ArgonTypography variant='button1'>Giỏ hàng bạn còn trống</ArgonTypography>
          </ArgonBox>
      }

    </Box >
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <ShoppingCartIcon />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
