import React, { HTMLAttributes, useEffect } from "react";
import {
  styled,
  useTheme,
  createStyles,
  Theme,
  CSSObject,
} from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { MenuList } from "../../lib/menu";
import { NavLink } from "../link";
import styledComponent from "styled-components";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import { clearCredentials, store } from "../../redux";
import { persistStore } from "redux-persist";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(5, 1, 10, 1),
  width: "100%",
  overflow: "visible",
  // necessary for content to be below app bar
  //   ...theme.mixins.toolbar,
}));

const LogoutButton = styled(Button)({
  borderColor: "#888888",
  color: "#888888",
  padding: "10px  50px",
});

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const useStyles = makeStyles({
  paper: {
    background: "#121212",
    color: "white",
  },
  iconWrapper: {
    color: "white",
  },
});

interface Props extends HTMLAttributes<HTMLDivElement> {
  root: any;
}

export function SideBar({
  drawerWidth,
  open,
}: {
  drawerWidth: number;
  open: boolean;
}) {
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials);

    localStorage.clear();

    persistStore(store).purge();

    router.push("/login");
  };

  const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(9)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    backgroundColor: "#161616",
    color: "white",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const DrawerFooter = styled("div")(() => ({
    position: "absolute",
    bottom: "20px",
    textAlign: "center",
    right: "50%",
    transform: "translateX(50%)",
  }));

  const MenuCount = styled("span")({
    background: "#FE4545",
    borderRadius: "19px",
    color: "#ffff",
    fontSize: "10px",
    padding: "1px 15px",
  });

  const StyledNavLink = styled(NavLink)`
    .active-link {
      color: #eaca1f !important;
    }
  `;

  return (
    <Drawer classes={{ paper: classes.paper }} variant="permanent" open={open}>
      <DrawerHeader>
        <Image
          onClick={() => router.push("/dashboard")}
          height={open ? "100%" : "40px"}
          width={open ? "150%" : "100%"}
          layout="fixed"
          src="/images/logo.png"
          alt="Picture of the author"
        />
      </DrawerHeader>
      <List>
        {MenuList.map((menu) => (
          <StyledNavLink key={`navlink ${menu.route}`} href={menu.route}>
            <ListItem
              button
              key={menu.route}
              secondaryAction={menu.countable ? <MenuCount>5</MenuCount> : ""}
            >
              <ListItemIcon classes={{ root: classes.iconWrapper }}>
                <menu.icon />
              </ListItemIcon>
              <ListItemText primary={menu.display} />
            </ListItem>
          </StyledNavLink>
        ))}
      </List>
      {open ? (
        <DrawerFooter>
          <LogoutButton onClick={() => handleLogout()} variant="outlined">
            Log out
          </LogoutButton>
        </DrawerFooter>
      ) : (
        <DrawerFooter>
          <LogoutIcon onClick={() => handleLogout()} />
        </DrawerFooter>
      )}
    </Drawer>
  );
}
