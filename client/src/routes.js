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
import AuditTrail from "./pages/AuditTrail";
import Leads from "./pages/Leads";
import { Navigate, redirect } from "react-router-dom";
import { AES, enc } from "crypto-js";
import Cookies from "js-cookie";

const getUserRole = () => {
    const role = Cookies.get('role_name') ?? 'user'; // default role user if cookie not found
    const decryptedRole = role === 'user' ? 'user' : AES.decrypt(role, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
    return decryptedRole;
};

const RoleBasedRoute = ({ element, allowedRoles }) => {
    const userRole = getUserRole();
    const isAllowed = allowedRoles.includes('*') || allowedRoles.includes(userRole); // Check if allowedRoles includes '*' or the user's role
    return isAllowed ? element : <Navigate to="/not-found" replace />;
};

const childRoutes = [
    {
        index: true,
        loader: () => redirect("/main/page/inventory")
    },
    {
        path: 'inventory',
        element: <RoleBasedRoute element={<InventoryControl />} allowedRoles={['*']} />
    },
    {
        path: 'inventory/products-list',
        element: <RoleBasedRoute element={<Products />} allowedRoles={['*']} />
    },
    {
        path: 'inventory/suppliers',
        element: <RoleBasedRoute element={<Supplier />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'inventory/purchase-orders',
        element: <RoleBasedRoute element={<PurchaseOrder />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'inventory/categories',
        element: <RoleBasedRoute element={<Category />} allowedRoles={['*']} />
    },
    {
        path: 'inventory/warehouse-management',
        element: <RoleBasedRoute element={<Warehouse />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'users',
        element: <RoleBasedRoute element={<UserAccounts />} allowedRoles={['Super Admin', 'Administrator']} />
    },
    {
        path: 'profile',
        element: <RoleBasedRoute element={<Profile />} allowedRoles={['*']} />
    },
    {
        path: 'profile/update-profile',
        element: <RoleBasedRoute element={<UpdateProfile />} allowedRoles={['*']} />
    },
    {
        path: 'profile/change-password',
        element: <RoleBasedRoute element={<ChangePassword />} allowedRoles={['*']} />
    },
    {
        path: 'delivery',
        element: <RoleBasedRoute element={<ProductDelivery />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'delivery/delivery-items',
        element: <RoleBasedRoute element={<ItemDelivery />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'delivery/customers',
        element: <RoleBasedRoute element={<Customers />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'delivery/delivery-persons',
        element: <RoleBasedRoute element={<DeliveryPersons />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
    },
    {
        path: 'audit-trails',
        element: <RoleBasedRoute element={<AuditTrail />} allowedRoles={['Super Admin', 'Administrator']} />
    },
    {
        path: 'leads',
        element: <RoleBasedRoute element={<Leads />} allowedRoles={['Super Admin', 'Administrator', 'Staff Manager']} />
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
        path: '/not-found',
        element: <Notfound />
    },
    {
        path: '*',
        element: <Navigate to="/not-found" replace />
    },
    {
        path: '/main/page',
        element: <Home />,
        children: childRoutes
    }
];

export default appRoutes;