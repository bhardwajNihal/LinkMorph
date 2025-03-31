import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Applayout from "./Layout/Applayout"
import LandingPage from "./pages/LandingPage"
import Dashboard from "./pages/Dashboard"
import Auth from "./pages/Auth"
import LinkPage from "./pages/LinkPage"
import Redirect from "./pages/Redirect"


const router = createBrowserRouter([

  {
    element : <Applayout/>,     // all the child routes will be rendered in outlet inside appLayout
    children : [
      {path : "/", element : <LandingPage/>},
      {path : "/dashboard", element : <Dashboard/>},
      {path : "/auth", element : <Auth/>},
      {path : "/link/:id" , element : <LinkPage/>},
      {path : "/:id" , element : <Redirect/>}
    ]
  }
  
])

function App() {

  return (          // wrapping whole app inside the context provider
      <RouterProvider router={router}/> 
  )
}

export default App
