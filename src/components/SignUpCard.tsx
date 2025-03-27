
const SignUpCard = () => {

    function handleSignup(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        console.log("user signed up!!!");
    }

  return (
    <form
    className="h-full w-full border border-gray-700 rounded-lg flex flex-col p-6 gap-4"
    onSubmit={handleSignup}>
        <input 
        className="w-full border border-gray-800 py-3 px-6 rounded"
        type="email" placeholder='email' />
        <input 
        className="w-full border border-gray-800 py-3 px-6 rounded"
        type="password" placeholder='password' />
        <input 
        className="w-full border border-gray-800 py-3 px-6 rounded"
        type="password" placeholder='confirm password' />
        <button 
        className="w-full bg-blue-600 py-3 px-6 rounded"
        type='submit'>Submit</button>
    </form>
  )
}

export default SignUpCard