import { MouseEventHandler, useState } from 'react';
import { AppBar, Box, IconButton, Hidden } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { MenuListDropdownStyle } from '@/styleMUI';
import { Button, Menu } from '@mui/material';
import PEOPLE from '@/utils/flatfiles/people_page_data.json';
import { ColumnSelector } from '@/components/FcComponents/ColumnSelectorTable/ColumnSelector';
import { useNavigate } from 'react-router-dom';
import { DrawerMenuPeopleBar } from './DrawerMenuPeopleBar';
import '@/style/Nav.scss';

export default function NavBarPeople() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [anchorFilterMobileEl, setAnchorFilterMobileEl] =
    useState<null | HTMLElement>(null);

  const handleMenuFilterMobileClose = () => {
    setAnchorFilterMobileEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectMenuItems = (item: string) => {
    // Define the logic for navigating to the desired path based on the value of 'item'
    if (item === 'About') {
      navigate('/PastHomePage');
    } else if (item === 'Enslaved') {
      navigate('/PastHomePage/enslaved');
    } else if (item === 'Enslavers') {
      navigate('/PastHomePage/enslaver');
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <AppBar
        component="nav"
        style={{
          backgroundColor: '#ffffff',
          fontSize: 12,
          boxShadow: 'none',
          marginTop: '3rem',
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Hidden mdUp>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Box
            className="menu-nav-bar-select-box"
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block',
                lg: 'block',
                textAlign: 'center',
                paddingRight: 40,
                fontWeight: 600,
                fontSize: 20,
              },
            }}
          >
            {PEOPLE[0].header?.map((item, index) => {
              return (
                <Button
                  onClick={() => handleSelectMenuItems(item)}
                  key={`${item}-${index}`}
                  sx={{
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: 20,
                    margin: '0 2px',
                    textTransform: 'none',
                    fontFamily: 'Cormorant Garamond',
                  }}
                >
                  <div>{item}</div>
                </Button>
              );
            })}
          </Box>
        </Toolbar>
        <Box component="nav">
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={handleMenuClose}
          >
            <DrawerMenuPeopleBar
              value={PEOPLE[0]?.header}
              handleSelectMenuItems={handleSelectMenuItems}
            />
          </Menu>
        </Box>
      </AppBar>
      <Menu
        anchorEl={anchorFilterMobileEl}
        open={Boolean(anchorFilterMobileEl)}
        onClick={handleMenuFilterMobileClose}
      >
        <MenuListDropdownStyle>
          <ColumnSelector />
        </MenuListDropdownStyle>
      </Menu>
    </Box>
  );
}
