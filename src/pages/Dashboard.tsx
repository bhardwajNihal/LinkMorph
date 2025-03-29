
import { useContext, useEffect } from "react"
import { urlContext} from "../Context/UrlContext"

const Dashboard = () => {

  const userContext = useContext(urlContext)

  useEffect(() => {
    console.log(userContext);
    
  },[userContext])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard