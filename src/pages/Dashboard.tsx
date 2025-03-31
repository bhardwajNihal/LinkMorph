import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../db/userAuth";


const Dashboard = () => {

  const navigate = useNavigate();

  async function checkIfAuthenticated(){
    const user = await getCurrentUser();
    if(!user) navigate("/");
  }

  useEffect(()=>{
    checkIfAuthenticated()
  })


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard