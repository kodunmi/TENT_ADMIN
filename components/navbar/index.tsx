import {
  AppBar,
  Badge,
  createTheme,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  PaletteMode,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, styled, Theme } from "@mui/system";
import React, { useEffect } from "react";
import NotificationsIcon from "remixicon-react/Notification2LineIcon";
import AccountCircle from "remixicon-react/User2LineIcon";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Search } from "@mui/icons-material";
import { SearchButton } from "..";
import { useAuth } from "../../hooks";
import { useRouter } from "next/router";

export function NavBar({ open, drawerWidth, action, title }) {
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const xs = useMediaQuery(theme.breakpoints.up("xs"));
  const [width, setWidth] = React.useState<number>();
  const StyledAppBar = styled(AppBar)((theme) => ({
    backgroundColor: isDarkModeEnabled ? "black" : "white",
    width: open ? `calc(100% - ${drawerWidth})` : "calc(100% - 50px)",
    float: !open ? "right" : "none",
  }));

  const { user } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    if (xs && !md && !sm) {
      setWidth(57);
    } else if (!md && sm) {
      setWidth(72);
    }
  }, [sm, xs, md]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const clickSearchButton = () => {
    console.log("clicked");
  };

  const StyledBreadcrumbs = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#FAFAFA" : "#0e0e0e",
    padding: "5px 20px",
    borderBottom: theme.palette.mode === "light" ? "1px solid #888888" : "none",
    position: "sticky",
    top: "0px",
    width: "100%",
  }));

  const StyledToolBar = styled(Toolbar)(({ theme }) => ({
    padding: "0px !important",
  }));

  const WidthBox = styled(Box)`
    width: calc(100vw - ${open ? drawerWidth : width}px);
    float: right;
  `;

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const { push } = useRouter();
  useEffect(() => {
    if (!user) {
      push("/login");
    }
  }, [user, push]);

  return user ? (
    <WidthBox>
      <AppBar
        style={{ boxShadow: "none" }}
        color={isDarkModeEnabled ? "transparent" : "inherit"}
        position="static"
      >
        <StyledToolBar>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box pl={2} sx={{ display: { xs: "none", md: "block" } }}>
            <Grid container>
              <Grid md={12} item>
                <Typography variant="subtitle1" component="p">
                  {user.fullName}
                </Typography>
              </Grid>
              <Grid md={12} item>
                <Typography variant="overline" component="p">
                  {user.username}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              // onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </StyledToolBar>
        <StyledToolBar>
          <StyledBreadcrumbs>
            <Grid
              style={{ justifyContent: "space-between" }}
              justifyContent="space-between"
              container
            >
              <Grid lg={8} md={6} sm={6} xs={12} item>
                {title}
              </Grid>
              <Grid lg={4} md={6} sm={6} xs={12} item>
                {action && action}
              </Grid>
            </Grid>
          </StyledBreadcrumbs>
        </StyledToolBar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </WidthBox>
  ) : (
    <p>Error</p>
  );
}
