import supabase from "./supabaseSetup";
import {UAParser} from "ua-parser-js"

export async function getclickInfoForAllUrls(urlIds:number[]) {
    
    const {data,error} = await supabase
    .from("click_info")
    .select("*")
    .in("url_id", urlIds);

    if(error) throw new Error(error.message);
    return data;
}

// api to store the clicks info, before redirecting to the original url page
// ua-parser - gives the info about the device
const parser = new UAParser();
export async function storeClicksInfoAndRedirect(id: number) {
  try {

    // console.log("Inside the Api to store ClickInfo API.");
    
    const response = parser.getResult();
    const device = response.device.type || "desktop";  // returns undefined for desktop in some cases, so to explicitely handle
    

    // // to get the location info there's an api - ipapi.co
    const res = await fetch("https://ipapi.co/json");
    const location = await res.json();
    const city = location.city;
    const country = location.country_name;

    // console.log("logging click data : ",city,country,device);
    

    //  store it in the clicks db
    await supabase.from("click_info").insert({
      url_id : id,
      city,
      country,
      device
    })
    // console.log("click info stored successfully!");
    // It is not good practice to call window.location.href from inside an api function
    // redirection should be handled by the component calling this function

  } catch (error) {
    throw new Error(`Error storing clicks Data !,${error}`);
  }
}


// getting click infos for a particular url
export async function getClickInfoForGivenUrl(url_id:string){

  const {data,error} = await supabase
  .from("click_info")
  .select("*")
  .eq("url_id", url_id)

  if(error) throw new Error(error.message);
  return data;
}