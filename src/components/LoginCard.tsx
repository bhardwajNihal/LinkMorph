import React, { useEffect, useState } from "react";
import { ErrorComp } from "./Error";
import * as yup from "yup";
import { AuthorizeLogin } from "../db/userAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {ClipLoader} from "react-spinners"
import { useFetch } from "../customHooks/useFetch";

const LoginCard = () => {

    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string,string>>({});
    // const [isAuthenticating, setIsauthenticating] = useState(false)
    const [searchParams] = useSearchParams();
    const longUrl = searchParams.get("createNew");
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name,value} = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    //calling the custom hook to auth login
    const { data,error:loginError,loading,callCb:login} =  useFetch(AuthorizeLogin);

    useEffect(()=>{
        if(data && !loginError){
            if(longUrl) navigate(`/dashboard?createNew=${longUrl}`);
            else navigate("/dashboard");
        }
        
    },[data,loginError,longUrl,navigate])

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // console.log(formData);

        setErrors({});
        try {
            const inputSchema = yup.object().shape({
                email : yup.string().required("Email is required!").email("Invalid Email format!"),
                password : yup.string().required("Password is required!").min(6, "Password must have atleast 6 characters!")
            })
            
            await inputSchema.validate(formData, {abortEarly:false})
            // const response = await AuthorizeLogin(formData);
            // console.log(response);

            // calling the callback login function provided by useFetch
            await login(formData)
            

        } catch (e) {
            if(e instanceof yup.ValidationError){
                const newErrors:Record<string,string> = {};
                e.inner.forEach((err) => {
                    if(err.path) newErrors[err.path] = err.message;
                })
                setErrors(newErrors);
            }
            // else setErrors({"authError" : "Invalid credentials!"});
        }

    }

    return (
        
        <form
            className="w-full border border-gray-700 rounded-lg flex flex-col p-6 gap-4"
            onSubmit={handleLogin}>
                <h2 className="text-center">Continue <b>Login</b><br /> <span className="text-gray-500">If already registered!</span></h2>
            <div className="text-center">{loginError && <ErrorComp message={loginError.message} /> }</div>
            <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-800 py-3 px-6 rounded"
                type="email" placeholder='email' />
            {errors.email && <ErrorComp message={errors.email} />}
            <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border border-gray-800 py-3 px-6 rounded"
                type="password" autoComplete="current-password" placeholder='password' />
            {errors.password && <ErrorComp message={errors.password} />}
            <button
                disabled={loading}
                className="w-full bg-blue-600 py-3 px-6 rounded"
                type='submit'>{loading ? <ClipLoader size={"15px"}/> : "submit"}</button>
        </form>
    )
}

export default LoginCard