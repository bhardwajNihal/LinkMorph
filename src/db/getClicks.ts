import supabase from "./supabaseSetup";

export async function getclickInfoForAllUrls(urlIds:number[]) {
    
    const {data,error} = await supabase
    .from("click_info")
    .select("*")
    .in("url_id", urlIds);

    if(error) throw new Error(error.message);
    return data;
}