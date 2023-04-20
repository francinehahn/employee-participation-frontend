import axios from "axios"
import { useState, useEffect } from "react"


export function useRequestData(url, token) {
    const [data, setData] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        axios.get(url, {headers: {Authorization: token}}).then(
            response => {
                setIsLoading(false)
                setData(response.data)
                setError("")
            }
        ).catch(err => {
            setIsLoading(false)
            setError(err.response.data)
            setData(undefined)
        })
    }, [url, token])
    
    return [data, isLoading, setIsLoading, error]
}