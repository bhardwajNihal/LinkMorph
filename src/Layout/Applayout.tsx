import { Outlet } from "react-router-dom"       // renders all the child layouts
import { SiGithub } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import Header from "../components/Header";


const Applayout = () => {
    return (
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
            
            <Header/>

            <main>
                <Outlet />
            </main>

            <footer
                className="h-16 text-sm border-t border-gray-700 flex justify-center items-center text-muted-foreground gap-4 md:gap-8 ">
                <p>Made with ❤️ and learnings by Nihal Bhardwaj.</p>
                <a href=""><SiGithub className="text-lg" /></a>
                <a href=""><FaXTwitter className="text-lg" /></a>
            </footer>

        </div>
    )
}

export default Applayout