// defining functions to handle supabase apis

import supabase, { supabaseUrl } from "./supabaseSetup";

interface loginProps {
  email: string;
  password: string;
}

// function to handle login
export async function AuthorizeLogin({ email, password }: loginProps) {
  const { data,error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {data,error};
}

// getting user session for the logged in user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (!data.session) return null;
  if (error) throw new Error(error.message);
  return data.session;
}

interface signupProps {
  username: string;
  email: string;
  password: string;
  profile_pic: File | null;
}

/// signup with profile pic upload
export async function signup({
  username,
  email,
  password,
  profile_pic,
}: signupProps) {
  // file upload - db
  if (profile_pic) {
    const fileName = `dp-${username.split(" ").join("-")}-${Math.random()}`; // to generate a unique file name
    const { error: fileUploadError } = await supabase.storage
      .from("profile-pic") // should be same as the storage bucket name
      .upload(fileName, profile_pic);

    if (fileUploadError) {
      return fileUploadError;
    }

    // now signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile-pic/${fileName}`, //supabese storage bucket route
        },
      },
    });
    return {data,error};
  } 
  else throw new Error("Profile picture is required!");
}


export async function logout(){
  const {error} = await supabase.auth.signOut();
  return {error};
}