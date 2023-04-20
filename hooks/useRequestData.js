import axios from "axios"
import { useState, useEffect } from "react"


export function useRequestData(url, token, reload) {
    const [data, setData] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        axios.get(url, {headers: {Authorization: token}}).then(
            response => {
                setIsLoading(false)
                setData(response.data)
            }
        ).catch(err => {
            setIsLoading(false)
            setError(err)
        })
    }, [url, token, reload])
    
    return [data, isLoading, error]
}