import { Theme, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import router from "next/router";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { SideBar, NavBar } from "../components";
import { useToken } from "../hooks";

const drawerWidth = 200;

interface DashboardLayoutProps{
  children: ReactNode
  title: ReactElement | string
  action?: ReactElement
  background?: "light" | "deem"
}

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
  background?: "light" | "deem"
  theme?: Theme
  width:number
  lg?:boolean
  xs?:boolean
}>(({ theme, open, background, width, lg, xs }) => ({
  flexGrow: 1,
  padding: theme.spacing(lg? 3 : 1),
  // height: lg ? "calc(100vh - 120px)" : xs ? "calc(100vh - 240)" : "calc(100vh - 180px)",
  height: "auto",
  overflow:"scroll",
  position: "fixed",
  bottom: 0,
  right: 0,
  top: xs ? '140px' : '120px',
  paddingBottom: '20px',
  
  backgroundColor: background == "deem"  ?  theme.palette.background.paper : theme.palette.action.hover,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  float:'right',
  width: `calc(100vw - ${width}px)`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // marginLeft: drawerWidth,
    width: `calc(100vw - ${drawerWidth}px)`,
    
  }),
}));


export const DashboardLayout = ({ children , title, action, background}: DashboardLayoutProps) => {
    const [open, setOpen] = React.useState(false);
    const [width, setWidth] = React.useState<number>();
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));

    useEffect(() => {
        if (md) {
          setOpen(true);
        } else {
          setOpen(false);
        }
        
      }, [md]);

      useEffect(() => {
        if(xs && !md && !sm){
          setWidth(57)
        }else if(!md  && sm){
          setWidth(72)
        }
        
        
      }, [sm,xs,md])

    

  return (
    <div>
      <SideBar open={open} drawerWidth={drawerWidth}/>
      <NavBar title={title} action={action} open={open} drawerWidth={drawerWidth}/>
       <Main lg={lg} xs={xs} width={width} background={background} open={open}>{children}</Main>  
       {/* {children} */}
    </div>
  );
};
