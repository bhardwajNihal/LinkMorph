import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getOriginalUrl } from "../db/UrlsApi";

import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { storeClicksInfoAndRedirect } from "../db/ClicksApi";


const Redirect = () => {

  // get the id from the query params
  const queryParam = useParams()
  const short_id = queryParam.id;

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    async function redirect() {
      setLoading(true)
      try {
        console.log("On the redirect page!!!");
        console.log("calling the calling clickInfo api!");
        
        //fetch original url data, given the short/custom urls id
        const { id, original_url } = await getOriginalUrl(short_id!);
        console.log(id, original_url);
        console.log("redirecting...");


        // Store Click Info **before** redirecting
        console.log("Storing click info...");
        await storeClicksInfoAndRedirect(id, original_url);
        console.log("Click info stored! Redirecting now...");
        window.location.href = original_url;

      } catch (error) {
        console.error("Redirection Error : ", error);
        toast.error("Can't fetch the Original Url!", { position: "top-center" });
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    redirect()
  }, [short_id, navigate]);


  if (loading) return <div className="h-screen w-full flex justify-center items-start py-12"><ClipLoader size={"25px"} color="white" /> Redirecting...</div>

  return null;
}

export default Redirect