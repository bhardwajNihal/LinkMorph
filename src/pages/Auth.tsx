import { useNavigate, useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import LoginCard from "../components/LoginCard";
import SignUpCard from "../components/SignUpCard";
import { getCurrentUser } from "../db/userAuth";
import { useEffect } from "react";


const Auth = () => {

  // check if url exists 
  const [params] = useSearchParams();
  const longUrl = params.get('createNew');

  // check if user is already logged in , in case, redirect to dashboard
  const navigate = useNavigate();

  async function checkIfAuthenticated(){
    const user = await getCurrentUser();
    if(user) navigate("/dashboard");
  }

  useEffect(()=>{
    checkIfAuthenticated()
  })


  return (
    <div className="min-h-screen w-full flex flex-col gap-4 justify-center items-center p-4 sm:px-16">

      {(longUrl)
        ? <div  className="text-2xl font-semibold">Please login to continue!</div>
        : <h2 className="text-2xl font-semibold">Login/Signup</h2>
      }
         <div className="h-full w-full sm:w-2/3 lg:w-[400px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full h-12">
              <TabsTrigger className="w-1/2" value="login">Login</TabsTrigger>
              <TabsTrigger className="w-1/2" value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginCard/></TabsContent>
            <TabsContent value="signup"><SignUpCard/></TabsContent>
          </Tabs>
        </div>

      

    </div>
  )
}

export default Auth