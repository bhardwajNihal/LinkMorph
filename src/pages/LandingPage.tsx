import React, { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../db/userAuth";
import { FaLink } from "react-icons/fa";

const LandingPage = () => {

  const [inputUrl, setInputUrl] = useState("");
  const navigate = useNavigate();

  async function checkIfAuthenticated() {
    const user = await getCurrentUser();
    if (user) navigate("/dashboard");
  }

  useEffect(() => {
    checkIfAuthenticated()
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputUrl) navigate(`/auth?createNew=${inputUrl}`)
  }


  return (
    <div className="min-h-screen w-full lg:w-2/3 mx-auto px-4">

      <div className="fixed top-0 left-0 z-[-10] h-screen w-full flex justify-center items-center overflow-hidden object-cover "><FaLink size={"800px"} color="#101752" /></div>
      <div className="fixed top-0 left-0 z-[-5] h-screen w-full backdrop-blur-xl sm:backdrop-blur-2xl"></div>

      <div className="hero-section h-svh w-full text-center mx-auto flex flex-col items-center justify-center text-gray-1 00">
        <h2 className="text-3xl md:text-4xl font-bold mb-8"> The Smartest Way to Shorten your loooooong URLs, with</h2>
        <h1 className="text-5xl md:text-7xl font-black"><span className="text-blue-500">link</span><span>Morph</span></h1>
        <h1 className="text-lg md:text-xl font-semibold text-gray-400 mb-12 md:mt-[-8px] mr-7">Your URLs, but on a Diet.</h1>

        <div className="w-full">
          <form className="w-full sm:flex items-center w-full gap-2" onSubmit={handleSubmit}>
            <input
              className="h-12 w-full sm:w-5/6 border border-gray-500 backdrop-blur-3xl placeholder:px-4 rounded"
              type="url"
              placeholder="Type you long url..."
              onChange={e => setInputUrl(e.target.value)}
              value={inputUrl}
            />
            <button type="submit" className="bg-blue-600 rounded h-12 w-full mt-4 sm:mt-0 sm:w-1/6 hover:bg-blue-700 cursor-pointer">Morph It!</button>
          </form>
        </div>
      </div>

      <div className="features flex flex-col gap-16 mb-48">

        <div className="qr h-fit w-full gap-8 py-8 flex flex-col md:flex-row justify-center items-center text-center md:text-start border border-gray-700 md:p-6 rounded-lg">
          <div className="text h-full w-1/2 md:p-6 md:pt-12">
            <h2 className="text-3xl font-bold">QR Code</h2>
            <p className="text-lg text-gray-400">Genarated on the go. Just scan and reach to the original page.</p>
          </div>
          <div className="img h-full w-1/2 flex items-center justify-center">
            <img className="h-36 w-36" src="/assets/Screenshot 2025-04-06 221508.png" alt="" />
          </div>
        </div>

        <div className="location h-fit w-full gap-8 py-8 flex flex-col md:flex-row justify-center items-center text-center md:text-start border border-gray-700 md:p-6 rounded-lg">
          <div className="img h-full w-3/5 flex items-center justify-center ">
            <img className="h-full object-fit" src="/assets/Screenshot 2025-04-06 223828.png" alt="" />
          </div>
          <div className="text h-full w-1/2 md:p-6 md:pt-12">
          <h2 className="text-3xl font-bold">Location Info</h2>
          <p className="text-lg text-gray-400">Get stats about top cities, from where the click was initiated.</p>
          </div>
        </div>

        <div className="device h-fit w-full gap-8 py-8 flex flex-col md:flex-row justify-center items-center text-center md:text-start border border-gray-700 md:p-6 rounded-lg">
          <div className="text h-full w-1/2 md:p-6 md:pt-12">
          <h2 className="text-3xl font-bold">Device Info</h2>
          <p  className="text-lg text-gray-400">Which devices were most used. Help better understand the user's accessibility.</p>
          </div>
          <div className="img h-full p-4 flex items-center justify-center">
            <img className="h-full object-cover" src="/assets/Screenshot 2025-04-06 223728.png" alt="" />
          </div>
        </div>


      </div>


      <div className="accordians w-full border border-gray-700 rounded-lg px-4 mb-16">
        <Accordion type="single" collapsible className="w-full md:px-11">
          <AccordionItem className="py-2" value="item-1">
            <AccordionTrigger>
              WTF does a url shortener app actually do?
            </AccordionTrigger>
            <AccordionContent>
              A URL shortener takes a long, complex web link and converts it into a short, easy-to-share URL. When someone clicks the short link, they are instantly redirected to the original website.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="py-2" value="item-2">
            <AccordionTrigger>
              Why is it even used ?
            </AccordionTrigger>
            <AccordionContent>
              Shorter links are more manageable, saves space, and improves sharing on social media, messages, or emails, especially on a platform like X, where there is a word limit for each tweet.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="py-2" value="item-3">
            <AccordionTrigger>
              How does the LinkMorph URL shortener works?
            </AccordionTrigger>
            <AccordionContent>
              When you enter a long URL, my app generates a shorter version of
              that URL. This shortened URL redirects to the original long URL when
              accessed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="py-2" value="item-4">
            <AccordionTrigger>
              Do I need an account to use the app?
            </AccordionTrigger>
            <AccordionContent>
              <b>No</b> - for using the shorter link and to be redirected to the original Url. <br />
              <b>Yes</b> - for managing your URLs, view analytics, and customize your short URLs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="py-2" value="item-5">
            <AccordionTrigger>
              What analytics are available for my shortened URLs?
            </AccordionTrigger>
            <AccordionContent>
              You can view the number of clicks, geolocation data of the clicks
              and device types (mobile/desktop) for each of your shortened URLs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default LandingPage