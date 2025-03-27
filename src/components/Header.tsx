import { MdOutlineContentCut } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Link2Icon, LogOut } from "lucide-react";



const Header = () => {

    const user = false;
    const navigate = useNavigate()

    return (
        <div className="h-16 w-full border-b border-gray-700 flex justify-between items-center">

            <Link to={"/"}>
                <div className="logo flex justify-center items-center w-fit font-bold md:text-lg tracking-tighter">
                    <span className="mb-1 mr-[-2px] text-blue-500">Link</span>
                    <span className="text-3xl md:text-4xl"><MdOutlineContentCut /></span>
                    <span className="text-white mb-1 ml-[-10px]">morph</span>
                </div>
            </Link>


            <div className="options">
                {(!user)
                    ? <div><Button onClick={()=> navigate("/auth")} size={"sm"}>Login</Button></div>
                    : <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem><Link2Icon/> My links</DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-start items-center"><LogOut className="text-red-700"/><span className="text-red-700">Logout</span></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                }
            </div>

        </div>
    )
}

export default Header