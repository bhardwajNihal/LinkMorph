import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getOriginalUrl, storeClicksInfoAndRedirect } from "../db/UrlsApi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";


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

        //fetch original url data, given the short/custom urls id
        const { id, original_url } = await getOriginalUrl(short_id!);

        // Storing click info (for analytics, but didn't block redirection)
        storeClicksInfoAndRedirect(id, original_url).catch((err) =>
          console.error("Error storing click info:", err)
        );
        // Redirecting immediately
        window.location.href = original_url;

      } catch (error) {
        console.error("Error Redirecting to the original Url!", error);
        toast.error("Can't fetch Original Url!", { position: "top-center" });
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