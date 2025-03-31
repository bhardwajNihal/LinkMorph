import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../db/userAuth";
import { Copy, Download, Search, Trash } from "lucide-react";
import { getAllUrls } from "../db/getUrls";
import { getclickInfoForAllUrls } from "../db/getClicks";


interface urlType {
  created_at: string;
  id: number;
  user_id: string;
  title: string;
  original_url: string;
  short_url: string;
  custom_url?: string;
  qr_code: string;
}

interface clickType {
  id: number
  url_id: number;
  city: string;
  country: string;
  created_at: string;
  device: string;

}

const Dashboard = () => {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [urlsInfo, setUrlsInfo] = useState<urlType[]>([])
  const [clicksInfo, setClicksInfo] = useState<clickType[]>([]);
  const [filteredurls, setFilteredurls] = useState<urlType[]>([])


  useEffect(() => {
    async function checkIfAuthenticated() {
      const user = await getCurrentUser();
      if (!user) navigate("/");
      //fetch urls, based on userId
      const urls = await getAllUrls(user?.user.id)
      setUrlsInfo(urls);
    }
    checkIfAuthenticated()
  }, [navigate])

  // another useEffect to fetch clicks based on urlsInfo updated state
  useEffect(() => {
    //fetch the click info
    async function fetchClicksInfo() {
      const urlIds = urlsInfo?.map(url => url.id)
      const clicks = await getclickInfoForAllUrls(urlIds);
      setClicksInfo(clicks);
    }
    fetchClicksInfo();
  }, [urlsInfo])


  useEffect(() => {       //Since every word includes an empty string (""), all links pass the filter initially
    const filteredArr = urlsInfo.filter((url => url?.title.toLowerCase().includes(query.toLowerCase())));
    setFilteredurls(filteredArr);
  }, [query,urlsInfo])


  return (
    <div className="min-h-screen w-full ">

      <div className="stats h-full md:flex justify-center items-center mt-4 gap-4" >
        <div className="urls h-24 flex gap-2  p-4 items-end w-full md:w-1/2 border border-gray-700 rounded ">
          <h2 className="font-semibold text-5xl sm:6xl">{urlsInfo.length}</h2>
          <span className="text-muted-foreground text-lg">Links shortened!</span>
        </div>
        <div className="clicks h-24 mt-4 md:mt-0 flex gap-2 p-4 items-end w-full  md:w-1/2 border border-gray-700 rounded ">
          <h2 className="font-semibold text-5xl sm:6xl">{clicksInfo.length}</h2>
          <span className="text-muted-foreground text-lg">Total clicks.</span>
        </div>
      </div>

      <div className="list-heading flex justify-between pt-8 pb-4">
        <h1 className="text-2xl font-semibold">My Links</h1>
        <button className="bg-blue-700 rounded p-2">Create Link</button>
      </div>

      <div className="input h-12 relative">
        <input
          type="text"
          placeholder="search links..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value); console.log(query);
          }}
          className="h-full rounded w-full px-10 bg-gray-800" />
        <Search size={"22px"} color="gray" className="absolute top-3.5 left-3" />
      </div>

      <div className="h-fit linksList flex flex-col gap-4 h-fit w-full p-2 mt-4 ">

        {(filteredurls.length>0) ?  filteredurls.map((url) =>
          <div key={url.id} className="linkCard border border-gray-700 h-32 p-2 flex items-center gap-2 md:gap-4 relative">
            <div className="qrImage h-full w-[20%] md:w-[15%] lg:w-[10%] flex items-center">
              <img className="h-full w-full object-contain" src={url.qr_code} alt="" />
            </div>

            <div className="info-part h-full w-[80%] md:w-[85%] lg:w-[90%]">
              <h1 className="text-xl font-bold truncate max-w-[60%]">{url.title}</h1>
              <h2 className="text-lg sm:text-xl text-blue-600 truncate max-w-[90%]">https://LinkMorph/{url.short_url}</h2>
              <h3 className="text-gray-500 text-sm md:text-normal truncate max-w-[90%] ">{url.original_url}</h3>
              <h4 className="text-xs md:text-sm text-gray-600 mt-2">{new Date(url.created_at).toLocaleString()}</h4>
            </div>

            <div className="options absolute top-0 right-0 m-4 flex gap-2 sm:gap-4">
              <Copy size={"17px"} className="text-gray-500 text-sm hover:text-white cursor-pointer" />
              <Download size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />
              <Trash size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />
            </div>
          </div>)
          : <div className="text-muted-foreground text-center mt-4">No such Links found!</div>  
        }
      </div>
    </div>
  )
}

export default Dashboard