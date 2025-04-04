import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { clickType, urlType } from "./Dashboard";
import { deleteUrl, getUrl } from "../db/UrlsApi";
import { getCurrentUser } from "../db/userAuth";
import { getClickInfoForGivenUrl } from "../db/ClicksApi";
import { Download, Share, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, PieChart, Pie, Legend, Cell } from "recharts"


interface BarDataType {
  city: string;
  clicks: number;
}
interface PieDataType {
  device: string;
  number: number;
}

const LinkPage = () => {

  const params = useParams();
  const [urlData, setUrlData] = useState<urlType>();
  const [clicksData, setClicksData] = useState<clickType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const [barData, setBarData] = useState<BarDataType[]>([]);
  const [pieData, setPieData] = useState<PieDataType[]>([]);

  //fetch url, and clicks info on mount
  useEffect(() => {
    async function getStats() {
      // fetch userId from session
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/")     // if session not found redirect to homepage
            ; return
        };
        const url_id = params.id;
        if (!url_id) throw new Error("Can't fetch url Id!");
        //fetch url data, from the id params, and userId
        const urlInfo = await getUrl(url_id, user?.user.id);
        setUrlData(urlInfo)

        // finally fetching the clicks data for that particular url
        const clicksInfo = await getClickInfoForGivenUrl(url_id);
        setClicksData(clicksInfo);
      } catch (error) {
        console.error("Error Fetching Stats!", error);
      } finally {
        setLoading(false)
      }
    }
    getStats()
  }, [navigate, params.id])


  useEffect(() => {
    console.log("url data : ", urlData);
    console.log("clicks data : ", clicksData);


  }, [urlData, clicksData])

  async function handleDeleteUrl() {
    setIsDeleting(true);
    try {
      await deleteUrl(Number(params.id));
      toast.success("URL deleted!", { position: "bottom-center" });
      await new Promise(res => setTimeout(res, 100))
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL!", { position: "bottom-center" });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDownload() {         // took the blob, approach, as some browsers blocks the download of files from another domain
    try {
      if (!urlData?.qr_code) throw new Error("Can't fetch Qr code to download!");
      // fetch the image data from the qr_code url
      const ImgData = await fetch(urlData.qr_code);

      //convert the response image data to a blob, which is just like a binary file, containing info, in our local machine
      const blob = await ImgData.blob();

      // create a blob url, that browser can recognize as a local file
      const blobUrl = URL.createObjectURL(blob);      //This URL behaves like a downloadable file stored in memory.

      // creates an anchor element and set it href to the bloburl
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${urlData.title}_qr.png`

      // 5️⃣ Append anchor to the body, trigger a click, then remove it
      document.body.appendChild(anchor);
      anchor.click();  // Triggers the download
      document.body.removeChild(anchor);

      // This frees up memory after the download, so the Blob URL doesn’t stay in RAM.
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  }



  // preparing data for charts

  //barchart
  useEffect(() => {
    function createChartData() {
      const createdbarData = clicksData.reduce((acc, click) => {

        const city = click.city
        if (!acc[city]) {
          acc[city] = { city, clicks: 1 }
        }
        else {
          acc[city].clicks++;
        }

        return acc;
      }, {} as Record<string, BarDataType>)

      // console.log(createdbarData);
      const barDataArr = Object.values(createdbarData).slice(0, 10) // take top 10 data
      // console.log(barDataArr);

      setBarData(barDataArr);
    }
    createChartData()
  }, [clicksData])

  //pie chart
  useEffect(() => {
    function createPieChartData() {

      const createdPieData = clicksData.reduce((acc, click) => {

        const device = click.device;
        if (!acc[device]) {
          acc[device] = { device, number: 1 }
        }
        else {
          acc[device].number++;
        }
        return acc;
      }, {} as Record<string, PieDataType>)

      const createdPieDataArr = Object.values(createdPieData);
      setPieData(createdPieDataArr)
    }
    createPieChartData()
  }, [clicksData])

  // colors for pie chart
  const COLORS = ["#0096A7", "#5F36B1", "#123A15"];


  if (loading) return <div className="h-screen w-full pt-12 text-center"><ClipLoader size={"25px"} color="white" /> Fetching Stats...</div>

  return (
    <>

      <div className=" w-full h-12 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold truncate max-w-[50%]">{urlData?.title}</h2>

        <div className="options flex gap-4 ">
          <Share
            size={"17px"}
            className="text-gray-500 text-sm hover:text-white cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(`https://linkmorph.vercel.app/${urlData?.custom_url ? urlData.custom_url : urlData?.short_url}`)
              toast.success("Copied to Clipboard!", { position: "bottom-center" })
            }}
          />
          <Download
            onClick={handleDownload}
            size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />
          {isDeleting
            ? <ClipLoader color='gray' size={"15px"} />
            : <Trash2
              onClick={handleDeleteUrl}
              size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />}
        </div>
      </div>
      <div className="min-h-screen w-full flex flex-col md:flex-row gap-4 ">

        <div className="url-info w-full h-fit md:w-2/5 border border-gray-800 rounded p-6">

          <div className="qr flex flex-col gap-3 text-center justify-center items-center">
            <img className="h-44" src={urlData?.qr_code} alt="" />
            <h2 className="text-sm text-gray-600 px-6">Scan this QR code to reach the original Page!</h2>
          </div>

          <div className="details mt-4 w-full">
            <h2
              className="text-xl md:text-2xl sm:text-xl text-blue-600 break-words hover:underline cursor-pointer"
            >{`https://linkmorph.vercel.app/${urlData?.custom_url ? urlData.custom_url : urlData?.short_url}`}</h2>
            <br />
            <a
              target="_blank"
              href={urlData?.original_url}
              className="text-gray-400 mt-3 text-lg md:text-normal break-words hover:underline cursor-pointer"
            >{urlData?.original_url}</a>
            <h4>{urlData?.created_at ? <div className="mt-4"><span className="text-sm text-gray-500 mr-2">{new Date(urlData.created_at).toDateString()}</span><span className="text-xs text-gray-600">{new Date(urlData.created_at).toLocaleTimeString()}</span></div> : "No Date Provided!"}</h4>
          </div>
        </div>
        <div className="click-stats mb-8 w-full md:w-3/5 flex items-center flex-col gap-2">

          <div className="click-count h-16 flex px-4 justify-between items-end pl-4 pb-2 w-full border border-gray-800 rounded">

            <div className="div className text-2xl font-semibold">Stats</div>
            <div>
              <span className="text-lg text-gray-500">Total Clicks </span>
              <span className="text-3xl font-semibold">{clicksData.length}</span>
            </div>
          </div>

          <div className="h-92 w-full border border-gray-800 rounded">
            <div className="text-xl font-semibold p-2">Top cities</div>
            {barData.length > 0
              ? <ResponsiveContainer width={"100%"} height={"85%"}>
                <BarChart data={barData}>
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip contentStyle={{ color: "white", background: "black", borderRadius: "10px" }} />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              : <div className="text-center mt-24 justify-center items-center text-gray-800">No Data available yet...</div>
            }
          </div>

          <div className="h-92 w-full border mt-2 border-gray-800 text-white rounded">
            <div className="text-xl font-semibold p-2">Common devices</div>
            {pieData.length > 0
              ? <ResponsiveContainer width="100%" height={"85%"}>
                <PieChart>
                  <Pie
                    data={pieData}
                    nameKey="device"
                    dataKey="number"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`} // Only percentage
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} /> // color to cells
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "10px" }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              : <div className="text-center mt-24 justify-center items-center text-gray-800">No Data available yet...</div>
            }
          </div>
        </div>

      </div>
    </>
  )
}

export default LinkPage