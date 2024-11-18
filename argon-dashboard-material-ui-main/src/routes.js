/**
 =========================================================
 * Argon Dashboard 2 MUI - v3.0.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/argon-dashboard-material-ui
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

/**
 All of the routes for the Soft UI Dashboard React are added here,
 You can add a new route, customize the routes and delete the routes here.
 Once you add a new route on this file it will be visible automatically on
 the Sidenav.
 For adding a new route you can follow the existing routes in the routes array.
 1. The `type` key with the `collapse` value is used for a route.
 2. The `type` key with the `title` value is used for a title inside the Sidenav.
 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
 4. The `name` key is used for the name of the route on the Sidenav.
 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
 7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
 inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
 8. The `route` key is used to store the route location which is used for the react router.
 9. The `href` key is used to store the external links location.
 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
 10. The `component` key is used to store the component of its route.
 */

// Argon Dashboard 2 MUI layouts
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import Color from "layouts/manage/color";
import Size from "layouts/manage/size";
import Status from "layouts/manage/status";
import Banner from "layouts/manage/banner";
import Order from "layouts/manage/order";
import Account from "layouts/manage/account";
import Image from "layouts/manage/image";
import ForgotPassword from "layouts/authentication/forgot-password";
import Product from "layouts/manage/product";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import Category from "layouts/manage/category";
import Brand from "layouts/manage/brand";
// import FeatureSection from "layouts/clientuser";
import FeatureSection from "layouts/clientuser/home";
import OrderDetail from "layouts/manage/orderdetail";
import Role from "layouts/manage/role";
// import ShopDetail from "components/client/HasagiShopDetail";
import ShopDetail from "components/client/HasagiShopDetail/ShopDetails";
// import Shop from "components/client/HasagiShop";
import Shop from "components/client/HasagiShop/Shop";
import Cart from "components/client/HasagiCart";
import Contact from "components/client/HasagiContact";
import About from "components/client/HasagiAbout";
import Loi404 from "components/client/Hasagi404";
import HoiDap from "components/client/HasagiQ&A";

import Checkout from "components/client/HasagiCheckout";
import Favorite from "components/client/HasagiFavorite";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Complete from "components/client/HasagiComplete";
import History from "components/client/HasagiHistory";
import HistoryOrderDetail from "components/client/HasagiHistoryDetail";
import ProductDetail from "layouts/manage/productDetail";

const routes = [
  {
    type: "route",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-tv-2" />,
    component: <Dashboard />,
    showInSidenav: true,
    protected: true,
  },
  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: (
      <ArgonBox component="i" color="warning" fontSize="14px" className="ni ni-single-copy-04" />
    ),
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <SignUp />,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "route",
    name: "Thông tin cá nhân",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
    showInSidenav: true,
  },
  { type: "title", title: "Management pages", key: "manage-pages" },
  {
    type: "route",
    name: "Quản lý người dùng",
    key: "account",
    route: "/manage/account",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Account />,
    // protected: true,
  },
  {
    type: "route",
    name: "Quản lý vai trò",
    key: "role",
    route: "/manage/role",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Role />,
  },
  {
    type: "route",
    name: "Quản lý sản phẩm",
    key: "product",
    route: "/manage/product",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Product />,
  },
  {
    name: "Manage Product Detail",
    key: "product-detail",
    route: "/manage/product-detail",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <ProductDetail />,
  },
  {
    type: "route",
    name: "Quản lý danh mục",
    key: "category",
    route: "/manage/category",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Category />,
  },
  {
    type: "route",
    name: "Quản lý thương hiệu",
    key: "brand",
    route: "/manage/brand",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Brand />,
  },
  {
    type: "route",
    name: "Quản lý màu sắc",
    key: "Manage Color",
    route: "/manage/color",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Color />,
  },
  {
    type: "route",
    name: "Quản lý kích thước",
    key: "size",
    route: "/manage/size",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Size />,
  },
  {
    // type: "route",
    name: "Feature Section",
    key: "feature-section",
    route: "/feature-section",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <FeatureSection />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "Favorite",
    key: "Favorite",
    route: "/Favorite",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Favorite />,
    showInSidenav: true,
  },

  {
    type: "route",
    name: "Quản lý đơn hàng",
    key: "order",
    route: "/manage/order",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Order />,
  },
  {
    type: "route",
    name: "Quản lý trạng thái",
    key: "status",
    route: "/manage/status",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Status />,
  },
  {
    type: "route",
    name: "Quản lý Banner",
    key: "banner",
    route: "/manage/banners",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Banner />,
  },
  {
    type: "route",
    name: "Manage Image",
    key: "image",
    route: "/manage/images",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Image />,
  },

  {
    type: "collapse",
    name: "Order Detail",
    key: "orderDetail",
    route: "/api/orderdetails",
    component: <OrderDetail />,
    noCollapse: true,
  },

  {
    // type: "route",
    name: "Shop Detail",
    key: "Shop Detail",
    route: "/ShopDetail",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ShopDetail />,
    showInSidenav: true,
  },
  {
    name: "Shop",
    key: "Shop",
    route: "/Shop",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Shop />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "Cart",
    key: "Cart",
    route: "/Cart",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Cart />,
    showInSidenav: true,
  },

  {
    // type: "route", 
    name: "Contact",
    key: "contact",
    route: "/Contact",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Contact />,
    showInSidenav: true,
  },
  {
    // type: "route", 
    name: "About",
    key: "about",
    route: "/About",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <About />,
    showInSidenav: true,
  },
  {
    // type: "route", 
    name: "Loi404",
    key: "loi404",
    route: "/Loi404",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Loi404 />,
    showInSidenav: true,
  },
  {
    // type: "route", 
    name: "HoiDap",
    key: "HoiDap",
    route: "/HoiDap",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <HoiDap />,
    showInSidenav: true,
  },
  {
    name: "Checkout",
    key: "Checkout",
    route: "/Checkout",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Checkout />,
    showInSidenav: true,
  },
  {
    name: "Banner",
    key: "banner",
    route: "/manage/banners",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Checkout />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "Complete",
    key: "Complete",
    route: "/Complete",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Complete />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "History",
    key: "History",
    route: "/History",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <History />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "HistoryOrderDetail",
    key: "Historyorderdetail",
    route: "/History-order/:orderId",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <HistoryOrderDetail />,
    showInSidenav: true,
  },
];

export default routes;