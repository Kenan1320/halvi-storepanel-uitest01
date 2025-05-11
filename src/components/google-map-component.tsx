"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { GoogleMap, Marker, useJsApiLoader, Libraries } from "@react-google-maps/api"

const libraries: Libraries = ["places"]

interface GoogleMapComponentProps {
  onAddressChange: (address: string, location: { lat: number; lng: number }) => void
  address: string
  location: { lat: number; lng: number }
}

export default function GoogleMapComponent({ onAddressChange, address, location }: GoogleMapComponentProps) {
  const [searchQuery, setSearchQuery] = useState(address)
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  // Initialize services when map is loaded
  useEffect(() => {
    if (isLoaded && map) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
      placesServiceRef.current = new window.google.maps.places.PlacesService(map)
      geocoderRef.current = new window.google.maps.Geocoder()
    }
  }, [isLoaded, map])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    }
    reverseGeocode(clickedLocation)
  }

  const reverseGeocode = (location: { lat: number; lng: number }) => {
    if (!geocoderRef.current) return

    geocoderRef.current.geocode({ location }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        setSearchQuery(results[0].formatted_address || '')
        onAddressChange(results[0].formatted_address || '', location)
      }
    })
  }

  const searchPlaces = (query: string) => {
    if (!autocompleteServiceRef.current || query.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    autocompleteServiceRef.current.getPlacePredictions(
      { input: query },
      (predictions, status) => {
        if (status === 'OK' && predictions) {
          setSuggestions(predictions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      }
    )
  }

  const selectAddress = (placeId: string, description: string) => {
    if (!placesServiceRef.current) return

    placesServiceRef.current.getDetails(
      { placeId },
      (place, status) => {
        if (status === 'OK' && place?.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
          setSearchQuery(description)
          onAddressChange(description, location)
          setShowSuggestions(false)
          
          // Center the map on the selected location
          if (map) {
            map.panTo(location)
            map.setZoom(15)
          }
        }
      }
    )
  }

  if (!isLoaded) {
    return <div className="w-full h-[400px] bg-muted rounded-md border flex items-center justify-center">
      Loading map...
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchPlaces(e.target.value)
              }}
              placeholder="Search for a location"
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button type="button" onClick={() => searchPlaces(searchQuery)}>
            Search
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                  onClick={() => selectAddress(suggestion.place_id, suggestion.description)}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {suggestion.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerClassName="w-full h-[400px] rounded-md border"
        center={location.lat && location.lng ? location : { lat: 0, lng: 0 }}
        zoom={location.lat && location.lng ? 15 : 2}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {location.lat && location.lng && (
          <Marker
            position={location}
            draggable
            onDragEnd={(e) => {
              if (!e.latLng) return
              const newPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              }
              reverseGeocode(newPosition)
            }}
          />
        )}
      </GoogleMap>

      {address && (
        <div className="text-sm">
          <p className="font-medium">Selected Address:</p>
          <p>{address}</p>
          <p className="text-muted-foreground">
            Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  )
}