import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../db/userAuth";
import { Search } from "lucide-react";
import { getAllUrls } from "../db/getUrls";
import { getclickInfoForAllUrls } from "../db/getClicks";
import UrlCard from "../components/UrlCard";

export interface urlType {
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
  }, [query, urlsInfo])


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

        {(filteredurls.length > 0)
          ? filteredurls.map((url) =>
            <UrlCard
              id={url.id}
              key={url.id}
              title={url.title}
              original_url={url.original_url}
              short_url={url.short_url}
              custom_url={url.custom_url}
              qr_code={url.qr_code}
              created_at={url.created_at}
              setUrlsInfo={setUrlsInfo}

            />)
          : <div className="text-muted-foreground text-center mt-4">No Links found!</div>
        }
      </div>
    </div>
  )
}

export default Dashboard