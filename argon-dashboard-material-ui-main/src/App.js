import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import ArgonBox from "components/ArgonBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useArgonController, setMiniSidenav, setOpenConfigurator } from "context";
import brand from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import Cookies from 'js-cookie';
import ProtectedRoute from './ProtectedRoute ';
import "assets/css/nucleo-icons.css";
import "assets/css/nucleo-svg.css";


export default function App() {
  const [controller, dispatch] = useArgonController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor, darkSidenav, darkMode } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const location = useLocation();
  const { pathname } = location;

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // Bọc các route cần bảo vệ bằng ProtectedRoute
        return route.protected ? (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        ) : (
          <Route exact path={route.route} element={route.component} key={route.key} />
        );
      }

      return null;
    });

  const configsButton = (
    <ArgonBox
      position="fixed"
      bottom="2rem"
      right="2rem"
      zIndex={9}
      sx={{
        cursor: "pointer",
        transition: "all 300ms ease",
        "&:hover": {
          backgroundColor: "gray",
        },
      }}
      onClick={handleConfiguratorOpen}
    >
      <Icon sx={{ fontSize: "1.25rem" }}>settings</Icon>
    </ArgonBox>
  );

  // Lọc các routes dựa trên thuộc tính showInSidenav
  const filteredRoutes = routes.filter(route => route.showInSidenav !== false);

  // Kiểm tra nếu đường dẫn hiện tại là /feature-section
  const shouldShowSidenav = 
  pathname !== "/feature-section" 
  && pathname !== "/ShopDetail" 
  && pathname !== "/Shop" 
  && pathname !== "/Cart" 
  && pathname !== "/Contact" 
  && pathname !== "/Checkout" 
  && pathname !== "/Backup" 
  && pathname !== "/Favorite"
  && pathname !== "/Complete"
  && pathname !== "/History"
  && pathname !== "/profile" 
  && !pathname.startsWith("/history-order/");
  ;

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && shouldShowSidenav && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={darkSidenav || darkMode ? brand : brandDark}
              brandName="Hasagi Fashion"
              routes={filteredRoutes}
              showSidenav={true}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(filteredRoutes)}
          <Route path="*" element={<Navigate to="/feature-section" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && shouldShowSidenav && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={darkSidenav || darkMode ? brand : brandDark}
            brandName="Hasagi Fashion"
            routes={filteredRoutes}
            showSidenav={true}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(filteredRoutes)}
        <Route path="*" element={<Navigate to="/feature-section" />} />
      </Routes>
    </ThemeProvider>
  );
}
