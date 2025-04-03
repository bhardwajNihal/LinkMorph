import { MdOutlineContentCut } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Link2Icon, LogOut } from "lucide-react";
import { getCurrentUser, logout } from "../db/userAuth";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

const Header = () => {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<User>()
    const [isloggingOut, setIsloggingOut] = useState(false);

    useEffect(() => {
        async function checkIfAuthenticated() {
            const user = await getCurrentUser();
            setUserData(user?.user)
            if (user) setIsAuthenticated(true)
        }
        checkIfAuthenticated()
    })

    async function handleLogout(){
        setIsloggingOut(true)
        const {error} = await logout();
        if(error){
            console.error("Error Logging Out!", error.message);
        };
        setIsAuthenticated(false);
        setIsloggingOut(false);
        navigate("/");
        toast.success("Logged Out Successfully!",{position:"bottom-left"})
    }


    return (
        <div className="h-16 px-4 w-full border-b border-gray-700 flex justify-between items-center relative">
            <Link to={"/"}>
                <div className="logo flex justify-center items-center w-fit font-bold md:text-lg tracking-tighter">
                    <span className="mb-1 mr-[-2px] text-blue-500">link</span>
                    <span className="text-3xl md:text-4xl"><MdOutlineContentCut /></span>
                    <span className="text-white mb-1 ml-[-10px]">morph</span>
                </div>
            </Link>


            <div className="options">
                {(!isAuthenticated)
                    ? <div><button className="bg-blue-600 p-2 px-6 rounded cursor-pointer hover:bg-blue-700" onClick={() => navigate("/auth")}>Login</button></div>
                    : <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage className="object-cover" src={userData?.user_metadata.profile_pic} />
                                <AvatarFallback className="text-gray-600">U</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{userData?.user_metadata.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            onClick={() => navigate("/dashboard")}
                            ><Link2Icon /> My links</DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={handleLogout}
                                className="flex justify-start items-center">
                                <LogOut className="text-red-700" />
                                <span className="text-red-700">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                }
            </div>
            {isloggingOut && <div className="absolute bottom-0 w-full"><BarLoader width={"100%"} color="#2A7FFE"/></div>}
        </div>
        
    )
}

export default Header