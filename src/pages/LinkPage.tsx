import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { clickType, urlType } from "./Dashboard";
import { deleteUrl, getUrl } from "../db/UrlsApi";
import { getCurrentUser } from "../db/userAuth";
import { getClickInfoForGivenUrl } from "../db/ClicksApi";
import { Copy, Divide, Download, Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const LinkPage = () => {

  const params = useParams();
  const [urlData, setUrlData] = useState<urlType>();
  const [clicksData, setClicksData] = useState<clickType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

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
    await deleteUrl(Number(params.id));     // just deletes the link from the db, but the old state is not changed
    setIsDeleting(false);
    toast.success("Url deleted!", {
      position: "bottom-center"
    })
    await new Promise((res) => setTimeout(res, 100));
    navigate("/dashboard");
  }

  async function handleDownload() {         // took the blob, approach, as some browsers blocks the download of files from another domain
    try {
      if (!urlData) throw new Error("Can't fetch Qr code to download!");
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



  // prepare data for charts
  // display charts

  if (loading) return <div className="h-screen w-full pt-12 text-center"><ClipLoader size={"25px"} color="white" /> Fetching Stats...</div>

  return (
    <>

      <div className=" w-full h-12 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold truncate max-w-[50%]">{urlData?.title}</h2>

        <div className="options flex gap-4 ">
          <Copy
            size={"17px"}
            className="text-gray-500 text-sm hover:text-white cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(`https://linkmorph/${urlData?.custom_url ? urlData.custom_url : urlData?.short_url}`)
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

          <div className="details mt-4">
            <h2 className="text-xl md:2xl sm:text-xl text-blue-600 truncate max-w-[90%] hover:underline cursor-pointer w-fit">{`https://LinkMorph/${urlData?.custom_url ? urlData.custom_url : urlData?.short_url}`}</h2>
            <h3 className="text-gray-400 mt-3 text-lg md:text-normal text-wrap hover:underline cursor-pointer w-fit">{urlData?.original_url}</h3>
            <h4>{urlData?.created_at ? <div className="mt-4"><span className="text-sm text-gray-500 mr-2">{new Date(urlData.created_at).toDateString()}</span><span className="text-xs text-gray-600">{new Date(urlData.created_at).toLocaleTimeString()}</span></div> : "No Date Provided!"}</h4>
          </div>
        </div>
        <div className="click-stats mb-8 w-full md:w-3/5 flex items-center flex-col gap-2">

            <div className="click-count h-16 flex gap-3 justify-start items-end pl-4 pb-2 w-full border border-gray-800 rounded">
            <span className="text-lg text-gray-500">Total Clicks </span>
            <span className="text-4xl font-semibold">{clicksData.length}</span>
            </div>

          <div className="h-64 w-full border border-gray-800 rounded">

          </div>

          <div className="h-64 w-full border border-gray-800 rounded">

          </div>
        </div>

      </div>
    </>
  )
}

export default LinkPage