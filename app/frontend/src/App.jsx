import Home from "./Home/Home"
import Login from "./Login/Login";
import GoogleCallback from "./GoogleCallback/GoogleCallback";
import ReturnsPage from "./ReturnPage/ReturnPage";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider } from "./userContext";

function App() {
    const router = createBrowserRouter([
        {
            path:'/library',
            element: <Home />
        },
        {
            path:'/',
            element: <Login/>
        },
        {
            path: '/auth/callback',
            element: <GoogleCallback />
        },
        { 
            path: '/returns', 
            element: <ReturnsPage /> 
        },
        {
            path: '/admin',
            element: <AdminDashboard />
        }
    ])

    return(
        <UserProvider>
            <RouterProvider router={router}/>
        </UserProvider>
    )
}

export default App
