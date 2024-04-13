"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import useSWR from 'swr'

interface position {
    coord: [number, number]
    user: number
}

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false
});

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function MyPage() {
    const [coord, setCoord] = useState<[number, number]>([43.7009358, 7.2683912])
    const missionId = 1
    const userId = 2
    const [positions, setPositions] = useState<position[]>([])


    // useEffect(() => {
    //     let geoloc = navigator.geolocation
    //     if (geoloc) {
    //         console.log("Geolocation enable")
    //     } else {
    //         console.log("Geolocation is not supported by this browser.")
    //         return
    //     }
      
    //     const sendPosition = () => {
    //         geoloc.getCurrentPosition((position) => {
    //             setCoord([position.coords.latitude, position.coords.longitude])
    //             console.log(position.coords.latitude, position.coords.longitude)
    //             const { data, error } = useSWR({
    //                 url: `/api/sendposition/${coord[0]}/${coord[1]}`,
    //                 args: { 
    //                     userId: userId,
    //                     missionId: missionId
    //                 }
    //             }, fetcher)
    //         })
    //     }
        
    //     const interval = setInterval(sendPosition, 7000);
        
    //     return () => clearInterval(interval);
    // }, [])

    return <div>
      <Map />
    </div>
}