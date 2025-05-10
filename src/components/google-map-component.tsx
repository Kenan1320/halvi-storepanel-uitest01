"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"

interface GoogleMapComponentProps {
  onAddressChange: (address: string, location: { lat: number; lng: number }) => void
  address: string
  location: { lat: number; lng: number }
}

declare global {
  interface Window {
    google: any
  }
}

export default function GoogleMapComponent({ onAddressChange, address, location }: GoogleMapComponentProps) {
  const [searchQuery, setSearchQuery] = useState(address)
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Initialize Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCZkmFpx-yBkO-QlpBM4GrkOdEKWnBTV2I&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [])

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    // Initialize services
    autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
    placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current)

    // Create map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: location.lat && location.lng ? location : { lat: 0, lng: 0 },
      zoom: location.lat && location.lng ? 15 : 2,
      mapTypeControl: false,
      streetViewControl: false,
    })

    mapInstanceRef.current = map

    // Add marker if location is provided
    if (location.lat && location.lng) {
      addMarker(location)
    }

    // Add click listener to map
    map.addListener('click', (e: any) => {
      const clickedLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
      reverseGeocode(clickedLocation)
    })
  }

  const addMarker = (position: { lat: number; lng: number }) => {
    if (!window.google || !mapInstanceRef.current) return

    // Remove previous marker if exists
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      draggable: true
    })

    // Center map on marker
    mapInstanceRef.current.setCenter(position)

    // Add dragend listener
    markerRef.current.addListener('dragend', (e: any) => {
      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
      reverseGeocode(newPosition)
    })
  }

  const reverseGeocode = (location: { lat: number; lng: number }) => {
    if (!window.google) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        setSearchQuery(results[0].formatted_address)
        onAddressChange(results[0].formatted_address, location)
        addMarker(location)
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
      (predictions: any[], status: string) => {
        if (status === 'OK') {
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
      (place: any, status: string) => {
        if (status === 'OK') {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
          setSearchQuery(description)
          onAddressChange(description, location)
          addMarker(location)
          setShowSuggestions(false)
        }
      }
    )
  }

  // Update map when location prop changes
  useEffect(() => {
    if (mapInstanceRef.current && location.lat && location.lng) {
      mapInstanceRef.current.setCenter(location)
      addMarker(location)
    }
  }, [location])

  // Update search query when address prop changes
  useEffect(() => {
    setSearchQuery(address)
  }, [address])

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

      <div 
        ref={mapRef} 
        className="w-full h-64 bg-muted rounded-md border"
        style={{ minHeight: '400px' }}
      >
      
      </div>

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