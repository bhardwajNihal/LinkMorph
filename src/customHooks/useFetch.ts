// a custom hook to wrap all the fetch logic and related states

import { useState } from "react";

export function useFetch<T, Args extends unknown[]>(
    cb : (options : unknown, ...args: Args) => Promise<T>,
    options : unknown
){

    // defining states 
    const [data,setData] = useState<T|null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error|null>(null);

    async function callCb(...args:Args){
        setLoading(true);
        try {
            const res = await cb(options,...args);
            setData(res);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally{
            setLoading(false);
        }
    }

    return {data,loading,error, callCb}

}