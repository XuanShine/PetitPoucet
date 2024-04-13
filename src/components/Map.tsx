'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerIcon from '@/../node_modules/leaflet/dist/images/marker-icon.png'
import MarkerShadow from '@/../node_modules/leaflet/dist/images/marker-shadow.png'
import { useEffect, useState } from 'react'
import { useMap, useMapEvent } from 'react-leaflet/hooks'
import L from 'leaflet'
import useSWR from 'swr'


const fetcher = (url: any) => fetch(url).then((res) => res.json());

interface positionServer {
    id: number,
    userId: number,
    missionId: number,
    x: number,
    y: number,
    datetime: Date,
}

interface userServer {
    id: number
    username: string
}

interface dataServer {
    status: string,
    positions: positionServer[],
    users: userServer[]
}

const Map = () => {
    const [coord, setCoord] = useState<[number, number]>([43.7009358, 7.2683912])
    const missionId = 1
    const userId = 2
    const [positions, setPositions] = useState<positionServer[]>([])

    const SearchLocation = () => {
        return (
            <div className="search-location">
                <input type="text" placeholder="Search Location" />
            </div>
        )
    }

    const GetMyLocation = () => {
        const getMyLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setCoord([position.coords.latitude, position.coords.longitude])
                    console.log(position.coords.latitude, position.coords.longitude)
                })
            } else {
                console.log("Geolocation is not supported by this browser.")
            }
        }
        return (
            <div className="get-my-location">
                <button onClick={getMyLocation}>Get My Location</button>
            </div>
        )
    }

    const updateLocation = () => {
        let geoloc = navigator.geolocation
        geoloc.getCurrentPosition((position) => {
            let [x, y] = [position.coords.latitude + Math.random()/100, position.coords.longitude + Math.random()/100]
            setCoord([x, y])
            fetch(
                `/api/sendposition/${x}/${y}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        userId: userId,
                        missionId: missionId
                    })
                }
            ).then((res) => res.json())
            .then((data: dataServer) => {
                setPositions(data?.positions)
            })
        })
    }

    useEffect(() => {
        const interval = setInterval(updateLocation, 7000);
        return () => clearInterval(interval);
    }, [])


    function UpdateMapCentre(props:any) {
        const map = useMap();
        map.panTo(props.mapCentre);
        return null;
    }

    let redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let blueIcon = new L.Icon({
        iconUrl: MarkerIcon.src,
        iconRetinaUrl: MarkerIcon.src,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
        shadowUrl: MarkerShadow.src,
        shadowSize: [41, 41],
    });

    return (
        <div>
            <SearchLocation />
            <GetMyLocation />
            <button onClick={updateLocation}>Update Location</button>
            <MapContainer style={{
                height: '80vh',
                width: '100vw'
            }} center={coord} zoom={17} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <UpdateMapCentre mapCentre={coord} />

                { positions.map((pos) => (
                    <Marker key={pos.id} icon={(pos.userId == userId) ? redIcon : blueIcon} position={[pos.x, pos.y]}>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default Map