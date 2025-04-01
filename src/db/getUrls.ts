import supabase from "./supabaseSetup";

// function to fetch all urls for a given userId
    export async function getAllUrls(userId:string|undefined) {

        const {data,error} = await supabase
        .from("urls")
        .select("*")
        .eq("user_id",userId);

        if(error) throw new Error(error.message);
        return data;
    }

    export async function deleteUrl(url_id:number) {
        
        const {data,error} = await supabase
        .from("urls")
        .delete()
        .eq("id",url_id);

        if(error) throw new Error(error.message);
        return data;
    }