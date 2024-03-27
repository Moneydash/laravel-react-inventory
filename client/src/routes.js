import Home from "./pages/Home";
import Category from "./pages/Inventory Management/Category";
import ProductDelivery from './pages/DeliveryHub';
import Products from "./pages/Inventory Management/Products";
import PurchaseOrder from "./pages/Inventory Management/PurchaseOrder";
import Supplier from "./pages/Inventory Management/Supplier";
import Warehouse from "./pages/Inventory Management/Warehouse";
import InventoryControl from "./pages/InventoryControl";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/Profile Management/ChangePassword";
import UpdateProfile from "./pages/Profile Management/UpdateProfile";
import Register from "./pages/Register";
import UserAccounts from "./pages/UserAccounts";
import ItemDelivery from "./pages/Delivery Management/ItemDelivery";
import Customers from "./pages/Delivery Management/Customers";
import DeliveryPersons from "./pages/Delivery Management/DeliveryPersons";
import Notfound from "./pages/Notfound";

const childRoutes = [
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