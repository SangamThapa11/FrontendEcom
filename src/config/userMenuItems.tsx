import type { ItemType } from "antd/es/menu/interface";
import { AiOutlineBold, AiOutlineDollarCircle, AiOutlineFileImage, AiOutlineHome, AiOutlineInsertRowRight, AiOutlineMessage, AiOutlineShopping, AiOutlineShoppingCart, AiOutlineTeam } from "react-icons/ai";
import { NavLink } from "react-router";

export const AdminMenu: ItemType[] =
    [
        {
            key: "dashboard",
            title: "Dashboard",
            label: <NavLink to="/admin">Dashboard</NavLink>,
            icon: <AiOutlineHome />
        },

        {
            key: "banner",
            title: "Banner",
            label: <NavLink to="/admin/banner">Banner</NavLink>,
            icon: <AiOutlineFileImage />
        },
        {
            key: "category",
            title: "Category",
            label: <NavLink to="/admin/category">Category</NavLink>,
            icon: <AiOutlineInsertRowRight />
        },
        {
            key: "brand",
            title: "Brand",
            label: <NavLink to="/admin/brand">Brand</NavLink>,
            icon: <AiOutlineBold />
        },
        {
            key: "users",
            title: "Users",
            label: <NavLink to="/admin/users">Users</NavLink>,
            icon: <AiOutlineTeam />
        },
        {
            key: "products",
            title: "Products",
            label: <NavLink to="/admin/products">Products</NavLink>,
            icon: <AiOutlineShopping />
        },
        {
            key: "order",
            title: "Order",
            label: <NavLink to="/admin/order">Order</NavLink>,
            icon: <AiOutlineShoppingCart />
        },
        {
            key: "transaction",
            title: "Transaction",
            label: <NavLink to="/admin/transactions">Transaction</NavLink>,
            icon: <AiOutlineDollarCircle />
        },
        {
            key: "chat",
            title: "Message",
            label: <NavLink to="/admin/chat">Messages</NavLink>,
            icon: <AiOutlineMessage />
        },
    ];
export const SellerMenu: ItemType[] =
    [
        {
            key: "dashboard",
            title: "Dashboard",
            label: <NavLink to="/seller/">Dashboard</NavLink>,
            icon: <AiOutlineHome />
        },

        {
            key: "products",
            title: "Products",
            label: <NavLink to="/seller/products">Products</NavLink>,
            icon: <AiOutlineShopping />
        },
        {
            key: "order",
            title: "Order",
            label: <NavLink to="/seller/order">Order</NavLink>,
            icon: <AiOutlineShoppingCart />
        },
        {
            key: "transaction",
            title: "Transaction",
            label: <NavLink to="/seller/transactions">Transaction</NavLink>,
            icon: <AiOutlineDollarCircle />
        },
        {
            key: "chat",
            title: "Message",
            label: <NavLink to="/seller/chat">Messages</NavLink>,
            icon: <AiOutlineMessage />
        },
    ];