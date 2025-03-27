
interface ErrorType{
    message: string;
}

export const ErrorComp = ({message} : ErrorType) => {
  return (
    <div
    className="text-xs text-red-500"
    >{message}.!</div>
  )
}
