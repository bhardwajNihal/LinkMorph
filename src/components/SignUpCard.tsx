import React, { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup"
import { ClipLoader } from "react-spinners";
import { signup } from "../db/userAuth";
import { ErrorComp } from "./Error";

const SignUpCard = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const [loading, setLoading] = useState<boolean>(false);
  const [Inputerrors, setInputerrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    cfm_password: string;
    profile_pic: File | null;
  }>({
    username: "",
    email: "",
    password: "",
    cfm_password: "",
    profile_pic: null
  })

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];   // way to get the file
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setInputerrors((prev) => ({ ...prev, profile_pic: "Only images are allowed!" }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setInputerrors((prev) => ({ ...prev, profile_pic: "File size should be less than 10MB!" }));
        return;
      }
      setInputerrors((prev) => ({ ...prev, profile_pic: "" })); // Clear previous errors
      setFormData((prevData) => ({ ...prevData, profile_pic: file }))
    }
  }


  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInputerrors({})
    setLoading(true);

    try {
      const inputSchema = yup.object().shape({
        username: yup.string().min(2, "username must be atleast of 2 characters!").required("username is required!"),
        email: yup.string().required("Email is required!").email("Invalid Email format!"),
        password: yup.string().required("Password is required!").min(6, "Password must have atleast 6 characters!"),
        cfm_password: yup.string()
          .oneOf([yup.ref("password")], "Passwords must match!")
          .required("Password is required!"),
        profile_pic: yup
          .mixed()
          .test("fileRequired", "Profile pic is required!", (value) => value instanceof File)
          .test("fileType", "Only images are allowed!", (value) =>
            value instanceof File && ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
          .test("fileSize", "File size should be less than 10MB!", (value) =>
            value instanceof File && value.size <= 10 * 1024 * 1024)

      })

      await inputSchema.validate(formData, { abortEarly: false })

      // signup after input validation is successful
      const response = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_pic: formData.profile_pic
      })

      if ("error" in response && response.error) {
        setInputerrors({ signupError: response.error.message })
        setLoading(false);
        return;
      }

      if ("data" in response && response.data) {
        if (longUrl) navigate(`/dashboard?createNew=${longUrl}`);
        else navigate("/dashboard");
      }

      console.log("user signed up !");
      

    } catch (e) {
      if (e instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        e.inner.forEach((err) => {
          if (err.path) newErrors[err.path] = err.message
        })
        setInputerrors(newErrors)
      }
      else {
        setInputerrors({ signupError: "Something went wrong! Please try again." });
      }
    } finally {
      setLoading(false);
    }

  }


  return (
    <form
      className="h-full w-full border border-gray-700 rounded-lg flex flex-col p-6 gap-4"
      onSubmit={handleSignup}>
      <h2 className="text-center"><b>Register</b> yourself to continue!</h2>
      {Inputerrors.signupError && <ErrorComp message={Inputerrors.signupError} />}
      <input
        name="username"
        value={formData.username}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="text"
        placeholder="username"
        onChange={handleInputChange}
      />
      {(Inputerrors.username) && <ErrorComp message={Inputerrors.username} />}
      <input
        name="email"
        value={formData.email}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="email" placeholder='email'
        onChange={handleInputChange}
      />
      {(Inputerrors.email) && <ErrorComp message={Inputerrors.email} />}
      <input
        name="password"
        value={formData.password}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="password"
        autoComplete="new-password"
        placeholder='password'
        onChange={handleInputChange}
      />
      {(Inputerrors.password) && <ErrorComp message={Inputerrors.password} />}
      <input
        name="cfm_password"
        value={formData.cfm_password}
        className="w-full border border-gray-800 py-2 px-6 rounded"
        type="password"
        autoComplete="new-password"
        placeholder='confirm password'
        onChange={handleInputChange}
      />
      {(Inputerrors.cfm_password) && <ErrorComp message={Inputerrors.cfm_password} />}

      <div className="flex items-center py-2 px-6 border border-gray-800 rounded">
        <label className="text-gray-400 w-1/3">Profile pic </label>
        <input
          className="w-2/3 bg-gray-900 rounded text-gray-400 cursor-pointer text-sm p-1 focus:outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>
      {(Inputerrors.profile_pic) && <ErrorComp message={"profile pic is needed!"}/>}

      <button
        className={`w-full py-3 px-6 rounded ${(loading) ? "bg-gray-800" : "bg-blue-600"}`}
        disabled={loading}
        type='submit'>{loading ? <ClipLoader size={"15px"} /> : <span>Create Account</span>}</button>
    </form>
  )
}

export default SignUpCard