import supabase from "./supabaseSetup";

interface loginProps{
    email: string;
    password: string;
}

export async function AuthorizeLogin({email,password}:loginProps){

    const {data,error} = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if(error) throw new Error(error?.message);

    return data;
}


export async function getCurrentUser(){
    const {data, error} = await supabase.auth.getSession();
    if(!data.session) return null;                        
    if(error) throw new Error(error.message);
    return data.session?.user;
    
}