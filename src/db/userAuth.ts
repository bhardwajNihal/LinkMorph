import supabase, { supabaseUrl } from "./supabaseSetup";

interface loginProps {
  email: string;
  password: string;
}

export async function AuthorizeLogin({ email, password }: loginProps) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error?.message);

  return data;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (!data.session) return null;
  if (error) throw new Error(error.message);
  return data.session?.user;
}

interface signupProps {
  username: string;
  email: string;
  password: string;
  profile_pic: File | null;
}

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
      .from("profile-pic")                      // should be same as the storage bucket name
      .upload(fileName, profile_pic);

      if (fileUploadError){
        // throw new Error(fileUploadError.message)
        console.log("file upload error 1 !");
        
    };

  // now signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile-pic/${fileName}`,
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}
else console.log("file upload error 2 !");
 //throw new Error("Profile picture is required!");

}
