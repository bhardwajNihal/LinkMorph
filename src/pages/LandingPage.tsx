import React, { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom";


const LandingPage = () => {

  const [inputUrl, setInputUrl] = useState("");
  const navigate = useNavigate()

  function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(inputUrl) navigate(`/auth?createNew=${inputUrl}`)
  }


  return (
    <div className="min-h-screen w-full lg:w-2/3 mx-auto px-4">

      <div className="hero-section h-svh w-full text-center mx-auto flex flex-col items-center justify-center text-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold mb-8"> The Smartest Way to Shorten your loooooong URLs, with</h2>
        <h1 className="text-5xl md:text-7xl font-black"><span className="text-blue-500">Link</span><span>Morph</span></h1>
        <h1 className="text-lg md:text-xl font-semibold text-gray-400 mb-12 md:mt-[-8px] mr-5">Your URLs, But on a Diet.</h1>

        <div className="w-full">
          <form className="w-full sm:flex items-center w-full gap-2" onSubmit={handleSubmit}>
            <input
            className="h-12 w-full sm:w-5/6 bg-gray-800 placeholder:px-4 rounded-lg" 
            type="url" 
            placeholder="Type you long url..."
            onChange={e => setInputUrl(e.target.value)} 
            value={inputUrl}
            />
            <Button type="submit" className="h-12 w-full mt-4 sm:mt-0 sm:w-1/6">Shorten!</Button>
          </form>
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
              When you enter a long URL, our system generates a shorter version of
              that URL. This shortened URL redirects to the original long URL when
              accessed.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="py-2" value="item-4">
            <AccordionTrigger>
              Do I need an account to use the app?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Creating an account allows you to manage your URLs, view
              analytics, and customize your short URLs.
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