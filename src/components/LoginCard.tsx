import React, { useState } from "react";
import { ErrorComp } from "./Error";
import * as yup from "yup";
import { AuthorizeLogin } from "../db/userAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {ClipLoader} from "react-spinners"
import toast from "react-hot-toast";

const LoginCard = () => {

    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string,string>>({});
    const [loading, setLoading] = useState<boolean>(false);
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

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrors({});
        setLoading(true);


        try {
            const inputSchema = yup.object().shape({
                email : yup.string().required("Email is required!").email("Invalid Email format!"),
                password : yup.string().required("Password is required!").min(6, "Password must have atleast 6 characters!")
            })
            
            // validate input
            await inputSchema.validate(formData, {abortEarly:false})

            //once input is validate, log in the user
            
            const loggedIn = await AuthorizeLogin(formData);

            if(loggedIn.error){
                setErrors({authError:"Invalid credentials!"});
                setLoading(false);
                return;
            }

            // if login is successful and error is not thrown, simply navigate the user to the dashboard
            if(longUrl) navigate(`/dashboard?createNew=${longUrl}`);
            else navigate("/dashboard");
            toast.success("logged In successfully!", {position:"bottom-left"})

        } catch (e) {
            if(e instanceof yup.ValidationError){
                const newErrors:Record<string,string> = {};
                e.inner.forEach((err) => {
                    if(err.path) newErrors[err.path] = err.message;
                })
                setErrors(newErrors);
            }
            else {
                setErrors({ authError: "Something went wrong! Please try again." });
            }
        } finally{
            setLoading(false);
        }

    }

    return (
        
        <form
            className="w-full border border-gray-700 rounded-lg flex flex-col p-6 gap-4"
            onSubmit={handleLogin}>
                <h2 className="text-center">Continue <b>Login</b><br /> <span className="text-gray-500">If already registered!</span></h2>
            <div className="text-center">{errors.authError && <ErrorComp message={errors.authError} /> }</div>
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
                className={`w-full py-3 px-6 rounded hover:bg-blue-700 cursor-pointer ${(loading) ? "bg-gray-800":"bg-blue-600"}`}
                type='submit'>{loading ? <ClipLoader size={"15px"}/> : "submit"}</button>
        </form>
    )
}

export default LoginCard;