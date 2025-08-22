//import { BrowserRouter, Route, Routes } from "react-router"
import { createBrowserRouter, RouterProvider } from "react-router"
import LandingPage from "../pages/landingPage"
import RegisterPage from "../pages/auth/RegisterPage"
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage"
import UserLayoutPage from "../pages/layouts/UserLayoutPage"
import AdminDashboard from "../pages/dashboard/AdminDashboard"
import { UserRoles } from "./constants"
import SellerDashboard from "../pages/dashboard/SellerDashboard"
import BannerCreatePage from "../pages/Banners/BannerCreatePage"
import { Toaster } from 'sonner';
import ActivateUser from "../components/auth/ActivateUser"
import AuthLayoutPage from "../pages/layouts/AuthLayoutPage"
import NotFound from "../components/error/NotFoun"
import BannerListPage from "../pages/Banners/BannerListPage"
import BannerEditPage from "../pages/Banners/BannerEditPage"
import ChatListPage from "../pages/chat/ChatListPage"
import { UserLayoutProvider } from "../context/UserLayoutContext"
import UserPage from "../pages/Users/UsersPage"
import BrandList from "../pages/Brand/brandList"
import CategoryListPage from "../pages/Category/categoryList"
import ProductListPage from "../pages/Products/productList"
import OrderListPage from "../pages/Order/orderList"
import BrandCreatePage from "../pages/Brand/BrandCreatePage"
import BrandEditPage from "../pages/Brand/BrandEditPage"
import CategoryCreatePage from "../pages/Category/categoryCreatePage"
import CategoryEditPage from "../pages/Category/categoryEditPage"
import ProductCreatePage from "../pages/Products/productCreatePage"
import ProductEditPage from "../pages/Products/productEditPage"
import TransactionsPage from "../pages/transactions/transactionPage"
import ResetPasswordPage from "../pages/auth/ResetPassword"
import UserProfilePage from "../pages/userProfile/UserProfile"




const router = createBrowserRouter([
    {
        path: "/", Component: AuthLayoutPage,
        children: [
            {
                index: true, Component: LandingPage,
                handle: {
                    title: "Login Page",
                    subtitle: "Welcome to MyCommerce",
                    description: "Welcome to our E-Pasal platform! We’re excited to have you join our community of smart shoppers.",
                }
            },
            {
                path: "register", element: <RegisterPage />, handle: {
                    title: "Register Now",
                    subtitle: "New to MyCommerce?",
                    description: "Welcome to our E-Pasal platform! We’re excited to have you join our community of smart shoppers.",
                }
            },
            {
                path: "activate/:token", Component: ActivateUser, handle: {
                    title: "Welcome Back!",
                    subtitle: "Hop op!!!",
                    description: "Welcome to our E-Pasal platform! We’re excited to have you join our community of smart shoppers.",
                }
            },
            {
                path: "forget-password", Component: ForgetPasswordPage, handle: {
                    title: "You got stuck?",
                    subtitle: "Request to reset!!!",
                    description: "Welcome to our E-Pasal platform! We’re excited to have you join our community of smart shoppers.",
                }
            },
            {
                path: "reset-password/:token", Component: ResetPasswordPage, handle: {
                    title: "Type Your New Password?",
                    subtitle: "Request to reset!!!",
                    description: "Welcome to our E-Pasal platform! We’re excited to have you join our community of smart shoppers.",
                }
            },
        ]
    },


    {
        path: "/admin",
        //Component: UserLayoutPage, 
        element: <UserLayoutProvider>
            <UserLayoutPage role={UserRoles.ADMIN} />
        </UserLayoutProvider>,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "me", element: <UserProfilePage /> },
            { path: "banner", element: <BannerListPage /> },
            { path: "banner/create", element: <BannerCreatePage /> },
            { path: "banner/:id", element: <BannerEditPage /> },

            { path: "category", element: <CategoryListPage /> },
            { path: "category/create", element: <CategoryCreatePage /> },
            { path: "category/:id", element: <CategoryEditPage /> },

            { path: "brand", element: <BrandList /> },
            { path: "brand/create", element: <BrandCreatePage /> },
            { path: "brand/:id", element: <BrandEditPage /> },

            { path: "users", element: <UserPage /> },

            { path: "products", element: <ProductListPage /> },
            { path: "products/create", element: <ProductCreatePage /> },
            { path: "products/:id", element: <ProductEditPage /> },

            { path: "transactions", element: <TransactionsPage /> },

            { path: "order", element: <OrderListPage /> },
            { path: "chat", element: <ChatListPage /> },

            // { path: "order", element:<UserProfilePage/>},
            { path: "*", element: <NotFound redirect="/admin" /> }
        ]
    },

    {
        path: "/seller",
        element: <UserLayoutProvider>
            <UserLayoutPage role={UserRoles.SELLER} />
        </UserLayoutProvider>,
        children: [
            { index: true, element: <SellerDashboard /> },
            { path: "me", element: <UserProfilePage /> },
            { path: "products", element: <ProductListPage /> },
            { path: "products/create", element: <ProductCreatePage /> },
            { path: "products/:id", element: <ProductEditPage /> },

            { path: "transactions", element: <TransactionsPage /> },

            { path: "order", element: <OrderListPage /> },
            { path: "chat", element: <ChatListPage /> },
        ]
    },

    {
        path: "*", element: <NotFound redirect="/" />
    }
])
const RouterConfig = () => {
    return <>

        <Toaster position="top-right" richColors closeButton />
        <RouterProvider router={router}></RouterProvider>

        {/*
        <BrowserRouter>
         <Routes>
            <Route path="/" 
            //</Routes>Component={LandingPage}
            element={<LandingPage/>}>
            </Route>
         </Routes>
        </BrowserRouter> */}
    </>

}
export default RouterConfig