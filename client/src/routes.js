import Home from "./pages/Home";
import Category from "./pages/Inventory/Category";
import ProductDelivery from './pages/DeliveryHub';
import Products from "./pages/Inventory/Products";
import PurchaseOrder from "./pages/Inventory/PurchaseOrder";
import Supplier from "./pages/Inventory/Supplier";
import Warehouse from "./pages/Inventory/Warehouse";
import InventoryControl from "./pages/InventoryControl";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/Profile/ChangePassword";
import UpdateProfile from "./pages/Profile/UpdateProfile";
import Register from "./pages/Register";
import UserAccounts from "./pages/UserAccounts";
import ItemDelivery from "./pages/Delivery/ItemDelivery";
import Customers from "./pages/Delivery/Customers";
import DeliveryPersons from "./pages/Delivery/DeliveryPersons";
import Notfound from "./pages/Notfound";
import { redirect } from "react-router-dom";

const childRoutes = [
    {
        index: true,
        loader: () => redirect("/main/page/inventory")
    },
    {
        path: 'inventory',
        element: <InventoryControl />
    },
    {
        path: 'inventory/products-list',
        element: <Products />
    },
    {
        path: 'inventory/suppliers',
        element: <Supplier />
    },
    {
        path: 'inventory/purchase-orders',
        element: <PurchaseOrder />
    },
    {
        path: 'inventory/categories',
        element: <Category />
    },
    {
        path: 'inventory/warehouse-management',
        element: <Warehouse />
    },
    {
        path: 'users',
        element: <UserAccounts />
    },
    {
        path: 'profile',
        element: <Profile />
    },
    {
        path: 'profile/update-profile',
        element: <UpdateProfile />
    },
    {
        path: 'profile/change-password',
        element: <ChangePassword />
    },
    {
        path: 'delivery',
        element: <ProductDelivery />
    },
    {
        path: 'delivery/delivery-items',
        element: <ItemDelivery />
    },
    {
        path: 'delivery/customers',
        element: <Customers />
    },
    {
        path: 'delivery/delivery-persons',
        element: <DeliveryPersons />
    }
];

const appRoutes = [
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '*',
        element: <Notfound />
    },
    {
        path: '/main/page',
        element: <Home />,
        children: childRoutes
    }
];

export default appRoutes;