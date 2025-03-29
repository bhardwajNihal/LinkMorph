import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup"
import { useFetch } from "../customHooks/useFetch";
import { ClipLoader } from "react-spinners";
import { signup } from "../db/userAuth";

const SignUpCard = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const [Inputerrors, setInputerrors] = useState<Record<string,string>>({});
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    cfm_password : string;
    profile_pic: File | null;
  }>({
    username: "",
    email: "",
    password: "",
    cfm_password : "",
    profile_pic: null
  })

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];   // way to get the file
    if (file) {
      setFormData((prevData) => ({ ...prevData, profile_pic: file }))
    }
  }

  // useFetch for signing up
  const {data,error,loading,callCb:signupfn} = useFetch(signup)

  useEffect(()=>{
    console.log("error inside useEffect!");
    
    if(data && error==null){
      console.log("!data anderror is there")
      if(longUrl) navigate(`/dashboard?createNew=${longUrl}`);
      else navigate("/dashboard");
    }
  },[data,error,longUrl,navigate])

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // console.log(formData);

    //validate input
    setInputerrors({})
    try {
      const inputSchema = yup.object().shape({
        username : yup.string().min(2,"username must be atleast of 2 characters!").required("username is required!"),
        email: yup.string().required("Email is required!").email("Invalid Email format!"),
        password: yup.string().required("Password is required!").min(6, "Password must have atleast 6 characters!"),
        cfm_password : yup.string()
        .oneOf([yup.ref("password")], "Passwords must match!")  
        .required("Password is required!").min(6, "Password must have atleast 6 characters!"),
        profile_pic : yup.mixed().required("profile pic is required!")
        
      })

      await inputSchema.validate(formData, {abortEarly:false})

      //finally signup, once inputs are validated and passwords matched
      await signupfn(formData);
      console.log("User Signed Up!");

    } catch (e) {
      if(e instanceof yup.ValidationError){
        const newErrors:Record<string,string>= {};
        e.inner.forEach((err) => {
          if(err.path) newErrors[err.path] = err.message
        })
        setInputerrors(newErrors)
      }
    }

  }


  return (
    <form
      className="h-full w-full border border-gray-700 rounded-lg flex flex-col p-6 gap-4"
      onSubmit={handleSignup}>
        <h2 className="text-center"><b>Register</b> yourself to continue!</h2>
      <input
        name="username"
        value={formData.username}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="text"
        placeholder="username"
        onChange={handleInputChange}
      />
      {(Inputerrors.username) && <p className="text-sm text-red-600">{Inputerrors.username}</p>}
      <input
        name="email"
        value={formData.email}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="email" placeholder='email'
        onChange={handleInputChange}
      />
      {(Inputerrors.email) && <p className="text-sm text-red-600">{Inputerrors.email}</p>}
      <input
        name="password"
        value={formData.password}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="password"
        autoComplete="new-password"
        placeholder='password'
        onChange={handleInputChange}
      />
      {(Inputerrors.password) && <p className="text-sm text-red-600">{Inputerrors.password}</p>}
      <input
        name="cfm_password"
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="password"
        autoComplete="new-password"
        placeholder='confirm password'
        onChange={handleInputChange}
      />
      {(Inputerrors.cfm_password) && <p className="text-sm text-red-600">{Inputerrors.cfm_password}</p>}
      <div className="flex items-center py-2 px-6 border border-gray-800 rounded">
      <label className="text-gray-400 w-1/3">Profile pic </label>
      <input
        className="w-2/3 bg-gray-900 rounded text-gray-400 cursor-pointer text-sm p-1"
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />
      </div>
      {(Inputerrors.profile_pic) && <p className="text-sm text-red-600">{Inputerrors.profile_pic}</p>}

      <button
        className="w-full bg-blue-600 py-3 px-6 rounded"
        disabled={loading}
        type='submit'>{loading ? <ClipLoader size={"15px"}/> : <span>Create Account</span>}</button>
    </form>
  )
}

export default SignUpCard