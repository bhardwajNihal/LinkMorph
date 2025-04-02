import React, { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ErrorComp } from "./Error"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as yup from "yup"
import { BeatLoader } from "react-spinners"
import { QRCode } from 'react-qrcode-logo';
import { createUrl } from "../db/UrlsApi"
import { getCurrentUser } from "../db/userAuth"
import { urlType } from "../pages/Dashboard"
import toast from "react-hot-toast"

interface CreateUrlPopUpProps {
    setUrlsInfo: React.Dispatch<React.SetStateAction<urlType[]>>;       //update state,hence ui on adding new url
}

const CreateUrlPopUp: React.FC<CreateUrlPopUpProps> = ({ setUrlsInfo }) => {

    const navigate = useNavigate();
    const QrRef = useRef<QRCode>(null)
    const [params, setParams] = useSearchParams();
    const longUrl = params.get("createNew");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(longUrl !== null)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState<{
        title: string;
        longUrl: string;
        customUrl?: string;
    }>({
        title: "",
        longUrl: longUrl ? longUrl : "",
        customUrl: "",
    })


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    // defining yup schema for the input
    const InputSchema = yup.object().shape({
        title: yup.string().required("Title is required!").max(100, "Title should be less than 100 characters!"),
        longUrl: yup.string().url("This should be a valid Url!").required("Long Url is required!"),
        customUrl: yup.string().max(100, "keep it short!")
    })

    async function handleSubmit() {
        setErrors({});
        setLoading(true);

        try {
            // yup schema validation must be awaited
            await InputSchema.validate(formData, { abortEarly: false });

            // fetch the canvas element, convert it to blob, to be able to upload
            const canvas = document.querySelector("canvas");        //caution- there needs to be only one canvas in the dom, to avoid confusion
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas?.toBlob((blob) => resolve(blob));
            });

            if (!blob) throw new Error("Couldn't get QR code blob!");

            const user = await getCurrentUser();
            if (!user) {
                navigate("/")
                return;
            }
            // api call to createUrl
            const data = await createUrl({
                title: formData.title,
                original_url: formData.longUrl,
                custom_url: (formData.customUrl)?.split(" ").join("-"),         // removed spaces, added hyphen to form a slug
                qr_code: blob,
                user_id: user?.user.id
            })
            setIsDialogOpen(false);
            const newUrl = data[0];        // data is returned as array, 1st index
            setUrlsInfo((preData) => [...preData,newUrl])
            await new Promise((resolve) => setTimeout(resolve,100))    // some delay b/w, popup close and toast message
            toast.success("Link Shortened Successfully!😊🎉",
                {
                    position: 'bottom-center'
                }
            )


        } catch (e) {
            if (e instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                e.inner.forEach(err => {
                    if (err.path) newErrors[err.path] = err.message;
                })
                setErrors(newErrors);
            }
            else setErrors({ CreateUrlError: "something went wrong Creating Url!" });
        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open: boolean) => {
                setIsDialogOpen(open)
                if (!open) {
                    setParams({});
                    setFormData({
                        title: "",
                        longUrl: "",
                        customUrl: "",
                    });
                }
            }}
        >
            <DialogTrigger asChild >
                <button className="bg-blue-700 rounded p-2 cursor-pointer">Create New Link</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold mb-4">Create New</DialogTitle>
                </DialogHeader>
                {(formData.longUrl) ? <div className="qr border border-white mx-auto mb-2"><QRCode ref={QrRef} value={formData.longUrl} size={100} /></div> : null}
                <div className="flex flex-col gap-4 items-end ">
                    <input
                        className="border border-gray-600 rounded p-2 w-full"
                        type="text"
                        placeholder="Short Url's Title..."
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    {errors.title && <div className="w-full text-start"><ErrorComp message={errors.title} /></div>}
                    <input
                        className="border border-gray-600 rounded p-2 w-full"
                        type="url"
                        placeholder="Loooong Url..."
                        name="longUrl"
                        value={formData.longUrl}
                        onChange={handleInputChange}
                    />
                    {errors.longUrl && <div className="w-full text-start"><ErrorComp message={errors.longUrl} /></div>}
                    <div className="flex gap-2 w-full items-center">
                        <span className="w-fit p-2 border border-gray-600 rounded">linkmorph</span>/
                        <input
                            className="border border-gray-600 rounded p-2 w-full"
                            type="text"
                            placeholder="Custom Url...(optional)"
                            name="customUrl"
                            value={formData.customUrl}
                            onChange={handleInputChange}
                        />
                    </div>
                    {errors.customUrl && <div className="w-full text-start"><ErrorComp message={errors.customUrl} /></div>}
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="py-2 px-6 rounded bg-blue-600 text-white w-full sm:w-1/2 cursor-pointer hover:bg-blue-700">{loading ? <BeatLoader size={"5px"} color="white" /> : "Create"}</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUrlPopUp