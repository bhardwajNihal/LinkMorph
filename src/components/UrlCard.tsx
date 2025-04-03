import { Copy, Download, Trash2 } from 'lucide-react'
import { deleteUrl } from '../db/UrlsApi';
import React, { useState } from 'react';
import { BarLoader, ClipLoader } from 'react-spinners';
import { urlType } from '../pages/Dashboard';
import { toast } from "react-hot-toast"
import { useNavigate } from 'react-router-dom';

interface urlProps {
  id: number;
  title: string;
  original_url: string;
  short_url: string;
  custom_url?: string;
  qr_code: string;
  created_at: string;
  setUrlsInfo: React.Dispatch<React.SetStateAction<urlType[]>>;     // type for state update function
}


const UrlCard = ({ id, title, original_url, short_url, custom_url, qr_code, created_at, setUrlsInfo }: urlProps) => {

  const [isDeleting, setIsdeleting] = useState(false)
  const navigate = useNavigate()
  const [isNavigating, setIsNavigating] = useState(false);

  async function handleDownload() {         // took the blob, approach, as some browsers blocks the download of files from another domain
    try {
      // fetch the image data from the qr_code url
      const ImgData = await fetch(qr_code);

      //convert the response image data to a blob, which is just like a binary file, containing info, in our local machine
      const blob = await ImgData.blob();

      // create a blob url, that browser can recognize as a local file
      const blobUrl = URL.createObjectURL(blob);      //This URL behaves like a downloadable file stored in memory.

      // creates an anchor element and set it href to the bloburl
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = `${title}_qr.png`

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

  async function handleDeleteUrl(url_id: number) {
    setIsdeleting(true);
    await deleteUrl(url_id);     // just deletes the link from the db, but the old state is not changed
    setUrlsInfo((prevUrls) => prevUrls.filter(url => url.id !== url_id))  //updates the state and hence the ui
    setIsdeleting(false);
    toast.success("Url deleted!", {
      position: "bottom-center"
    })
  }

  return (
    <div
      className="linkCard border border-gray-700 h-32 p-2 flex hover:bg-gray-950 cursor-pointer items-center gap-2 md:gap-4 relative"
      onClick={async () => {
        setIsNavigating(true);
        await new Promise(res => setTimeout(res, 1000));    // mimicking fake load for better ux
        setIsNavigating(false);
        navigate(`/link/${id}`)
      }}
    >
      {isNavigating && <div className='w-full absolute bottom-0'><BarLoader width={"100%"} color='#2A7FFE' /></div>}
      <div className="qrImage h-full w-[20%] md:w-[15%] lg:w-[10%] flex items-center">
        <img className="h-full w-full object-contain" src={qr_code} alt="QrCode" />
      </div>

      <div className="info-part h-full w-[80%] md:w-[85%] lg:w-[90%]">
        <div className='tracking-tight'>
          <h1
            className="text-xl font-bold truncate max-w-[60%] ">{title}</h1>
          <h2 className="text-lg sm:text-xl text-blue-600 truncate max-w-[90%] hover:underline cursor-pointer w-fit">{`https://LinkMorph/${custom_url ? custom_url : short_url}`}</h2>
          <h3 className="text-gray-500 text-sm md:text-normal truncate max-w-[90%] hover:underline cursor-pointer w-fit">{original_url}</h3>
        </div>
        <h4 className="text-xs md:text-sm text-gray-600 mt-2">{new Date(created_at).toLocaleDateString()}</h4>
      </div>

      <div className="options absolute top-0 right-0 m-4 flex gap-2 sm:gap-4">
        <Copy
          size={"17px"}
          className="text-gray-500 text-sm hover:text-white cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(`https://linkmorph/${custom_url ? custom_url : short_url}`)
            toast.success("Copied to Clipboard!", { position: "bottom-center" })
          }}
        />
        <Download
          onClick={handleDownload}
          size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />
        {isDeleting
          ? <ClipLoader color='gray' size={"15px"} />
          : <Trash2
            onClick={() => handleDeleteUrl(id)}
            size={"17px"} className="text-gray-500 hover:text-white cursor-pointer" />}
      </div>
    </div>
  )
}

export default UrlCard