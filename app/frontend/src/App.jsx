import Home from "./Home/Home"
import Login from "./Login/Login";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
    const router = createBrowserRouter([
        {
            path:'/library',
            element: <Home />
        },
        {
            path:'/',
            element: <Login/>
        }
    ])

    return(
        <RouterProvider router={router}/>
    )
}

export default App
