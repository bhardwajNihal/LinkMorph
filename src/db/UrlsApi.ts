import supabase, { supabaseUrl } from "./supabaseSetup";

// function to fetch all urls for a given userId
export async function getAllUrls(userId: string | undefined) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUrl(url_id: number) {
  const { data, error } = await supabase.from("urls").delete().eq("id", url_id);

  if (error) throw new Error(error.message);
  return data;
}

interface urlInputType {
  title: string;
  original_url: string;
  custom_url?: string;
  qr_code: Blob;
  user_id: string;
}

export async function createUrl(url: urlInputType) {
  const shortUrl = Math.random().toString().substring(2, 7); // generate as random number, converts it to string, an take the digits, after the decimal point.

  // 1st the qr is uploaded to the storage bucket
  const fileName = `qr-${shortUrl}`;

  const { error: QrUploadError } = await supabase.storage
    .from("qrs")
    .upload(fileName, url.qr_code);

  if (QrUploadError) throw new Error(QrUploadError.message);

  //now the uploaded qrs path is fetched from the storage, to be later stored in the url table
  const qrCode_path = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  // now the url Info is stored in the db,
  const { data, error: insertUrlError } = await supabase
    .from("urls")
    .insert([
      // takes array of objects
      {
        title: url.title,
        original_url: url.original_url,
        short_url: shortUrl,
        custom_url: url.custom_url || null,
        qr_code: qrCode_path,
        user_id: url.user_id,
        // created_at and Id would be generated on the runtime naaa!
      },
    ])
    .select("*");

  if (insertUrlError) throw new Error(insertUrlError.message);
  return data;
}

// api to fetch the original url, given the short or custom url
export async function getOriginalUrl(id: string) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url") // only to select the given fields from the whole column
    .or(`short_url.eq.${id}, custom_url.eq.${id}`) // whatever matches, just return the column
    .single(); // return atmost one column

  if (error) throw new Error(error.message);

  return data;
}


// api to get a specific url's info, for the dedicated links page
export async function getUrl(id:string,user_id:string) {
  
  const {data,error} = await supabase
  .from("urls")
  .select("*")
  .eq("id",id)
  .eq("user_id", user_id)
  .single()

  if(error) throw new Error(error.message);
  return data;

}