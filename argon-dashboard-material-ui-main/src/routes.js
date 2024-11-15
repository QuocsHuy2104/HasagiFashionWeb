import Dashboard from "layouts/dashboard";
import Profile from "components/client/HasagiProfile";
import Color from "layouts/manage/color";
import Size from "layouts/manage/size";
import Status from "layouts/manage/status";
import Banner from "layouts/manage/banner";
import Order from "layouts/manage/order";
import Account from "layouts/manage/account";
import Image from "layouts/manage/image";
import ForgotPassword from "layouts/authentication/forgot-password";
import Product from "layouts/manage/product";
import Review from "layouts/manage/review";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import Category from "layouts/manage/category";
import Brand from "layouts/manage/brand";
import FeatureSection from "layouts/clientuser/home";
import OrderDetail from "layouts/manage/orderdetail";
import Role from "layouts/manage/role";
import ShopDetail from "components/client/HasagiShopDetail";
import Shop from "components/client/HasagiShop";
import Cart from "components/client/HasagiCart";
import Contact from "components/client/HasagiContact";
import Checkout from "components/client/HasagiCheckout";
import Favorite from "components/client/HasagiFavorite";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Complete from "components/client/HasagiComplete";
import History from "components/client/HasagiHistory";
import HistoryOrderDetail from "components/client/HasagiHistoryDetail";
import Voucher from "layouts/manage/voucher";
import ChatBot from "components/client/HasagiChatBot";

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
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
  },
  { type: "title", title: "Management pages", key: "manage-pages" },
  {
    type: "route",
    name: "Manage Account",
    key: "account",
    route: "/manage/account",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Account />,
    // protected: true,
  },
  {
    type: "route",
    name: "Manage Role",
    key: "role",
    route: "/manage/role",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Role />,
  },
  {
    type: "route",
    name: "Manage Product",
    key: "product",
    route: "/manage/product",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Product />,
  },
  {
    type: "route",
    name: "Manage Category",
    key: "category",
    route: "/manage/category",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Category />,
  },
  {
    type: "route",
    name: "Manage Brand",
    key: "brand",
    route: "/manage/brand",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Brand />,
  },
  {
    type: "route",
    name: "Manage Color",
    key: "Manage Color",
    route: "/manage/color",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Color />,
  },
  {
    type: "route",
    name: "Manage Size",
    key: "size",
    route: "/manage/size",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Size />,
  },
  {
    type: "route",
    name: "Manage Review",
    key: "review",
    route: "/manage/review",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Review />,
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
    name: "Manage Order",
    key: "order",
    route: "/manage/order",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Order />,
  },
  {
    type: "route",
    name: "Manage Status",
    key: "status",
    route: "/manage/status",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Status />,
  },
  {
    type: "route",
    name: "Manage Banner",
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
    type: "route",
    name: "Manage Voucher",
    key: "voucher",
    route: "/manage/voucher",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Voucher />,
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
    name: "Chat Bot",
    key: "chat Bot",
    route: "/chatBot",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ChatBot />,
    showInSidenav: true,
  },
  
  {
    // type: "route",
    name: "Shop Detail",
    key: "shop Detail",
    route: "/ShopDetail",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ShopDetail />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "Shop",
    key: "shop",
    route: "/Shop",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Shop />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "Cart",
    key: "cart",
    route: "/cart",
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
    name: "Checkout",
    key: "checkout",
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
    key: "complete",
    route: "/Complete",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Complete />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "History",
    key: "history",
    route: "/History",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <History />,
    showInSidenav: true,
  },
  {
    // type: "route",
    name: "HistoryOrderDetail",
    key: "historyorderdetail",
    route: "/history-order/:orderId",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <HistoryOrderDetail />,
    showInSidenav: true,
  },
];

export default routes;
