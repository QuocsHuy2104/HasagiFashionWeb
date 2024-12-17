import Dashboard from "layouts/dashboard";
import Profile from "components/client/HasagiProfile";
import Color from "layouts/manage/color";
import Size from "layouts/manage/size";
import Banner from "layouts/manage/banner";
import Order from "layouts/manage/order";
import Account from "layouts/manage/account";
import ForgotPassword from "layouts/authentication/forgot-password";
import ResetPassword from "layouts/authentication/reset-password";
import Product from "layouts/manage/product";
import Review from "layouts/manage/review";
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import About from "components/client/HasagiAbout";
import Category from "layouts/manage/category";
import Brand from "layouts/manage/brand";
// import FeatureSection from "layouts/clientuser";
import FeatureSection from "layouts/clientuser/index";
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
import ProductDetail from "layouts/manage/productDetail";
import { isAuthenticated } from "utils/Authen";
import { Navigate } from "react-router-dom";
import NotFoundPage from "components/client/Hasagi404";
import Voucher from "layouts/manage/voucher";
import ChatBot from "components/client/HasagiChatBot";
import QA from "components/client/HasagiQ&A";
import BaoMat from "components/client/HasagiBaoMat";
import DoiTra from "components/client/HasagiDoiTra";
import DieuKhoan from "components/client/HasagiDieuKhoan";
import OrderSummary from "layouts/billed"
const routes = [
  {
    type: "route",
    name: "Thống kê",
    key: "Thống kê",
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
    component: isAuthenticated() ? <Navigate to="/" /> : <SignIn />,
  },
  {
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <SignUp />,
  },
  //{ type: "title", title: "Trang tài khoản", key: "account-pages" },
  {
    //type: "route",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <ArgonBox component="i" color="dark" fontSize="14px" className="ni ni-single-02" />,
    component: <Profile />,
  },
  { type: "title", title: "Trang quản lý", key: "manage-pages" },
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
    type: "route",
    name: "Quản lý đánh giá",
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
    // type: "route",
    name: "ForgotPassword",
    key: "forgotpassword",
    route: "/forgot-password",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ForgotPassword />,
    showInSidenav: true,
  },
  // {
  //   name: "404",
  //   key: "notFound",
  //   route: "/not-Found",
  //   icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
  //   component: <Notfound />,
  //   showInSidenav: true,
  // },
  {
    // type: "route",
    name: "ResetPassword",
    key: "resetpassword",
    route: "/reset-password",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ResetPassword />,
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
    name: "Quản lý Banner",
    key: "banner",
    route: "/manage/banners",
    icon: <ArgonBox component="i" color="info" fontSize="14px" className="ni ni-collection" />,
    component: <Banner />,
  },
  {
    type: "route",
    name: "Quản lý phiếu giảm giá",
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
    name: "Q&A",
    key: "q&A",
    route: "/Q&A",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <QA />,
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
    name: "Shop Detail",
    key: "shop Detail",
    route: "/ShopDetail",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <ShopDetail />,
    showInSidenav: true,
  },
  {
    name: "shop",
    key: "shop",
    route: "/shop",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <Shop />,
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
  {
    name: "NotFound",
    key: "not-found",
    route: "/not-found",
    component: <NotFoundPage />,
    showInSidenav: true,
  }, {
    // type: "route", 
    name: "BaoMat",
    key: "BaoMat",
    route: "/BaoMat",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <BaoMat />,
    showInSidenav: true,
  },
  {
    // type: "route", 
    name: "DoiTra",
    key: "DoiTra",
    route: "/DoiTra",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <DoiTra />,
    showInSidenav: true,
  },
  {
    // type: "route", 
    name: "DieuKhoan",
    key: "DieuKhoan",
    route: "/DieuKhoan",
    icon: <ArgonBox component="i" color="success" fontSize="14px" className="ni ni-sound-wave" />,
    component: <DieuKhoan />,
    showInSidenav: true,
  },
  {
    name: "OrderSummary",
    key: "OrderSummary",
    route: "/OrderSummary",
    component: <OrderSummary />,
  },
];

export default routes;
