"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, ArrowLeft, Save } from "lucide-react"
import GoogleMapComponent from "./google-map-component"
import FileUpload from "./file-upload"
import TimePicker from "./time-picker"

export default function StoreSetupForm() {
  const router = useRouter()
  const [workingHours, setWorkingHours] = useState([
    { day: "Monday", from: "", to: "", enabled: true },
    { day: "Tuesday", from: "", to: "", enabled: true },
    { day: "Wednesday", from: "", to: "", enabled: true },
    { day: "Thursday", from: "", to: "", enabled: true },
    { day: "Friday", from: "", to: "", enabled: true },
    { day: "Saturday", from: "", to: "", enabled: true },
    { day: "Sunday", from: "", to: "", enabled: true },
  ])

  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [storyImage, setStoryImage] = useState<File | null>(null)
  const [storyVideo, setStoryVideo] = useState<File | null>(null)
  const [address, setAddress] = useState("")
  const [location, setLocation] = useState({ lat: 0, lng: 0 })

  const handleWorkingHoursChange = (index: number, field: string, value: any) => {
    const updatedHours = [...workingHours]
    updatedHours[index] = { ...updatedHours[index], [field]: value }
    setWorkingHours(updatedHours)
  }

  const handleGalleryUpload = (files: File[]) => {
    setGalleryFiles([...galleryFiles, ...files])
  }

  const handleStoryImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setStoryImage(files[0])
    }
  }

  const handleStoryVideoUpload = (files: File[]) => {
    if (files.length > 0) {
      setStoryVideo(files[0])
    }
  }

  const handleAddressChange = (address: string, location: { lat: number; lng: number }) => {
    setAddress(address)
    setLocation(location)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process form submission
    console.log("Form submitted")
    // Navigate back or to dashboard
    // router.push("/dashboard");
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mb-10">
      {/* STORE DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">STORE DETAILS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Store name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Amount</Label>
              <Input id="wallet" value="5000" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Select Section</Label>
              <Select disabled>
                <SelectTrigger id="section">
                  <SelectValue placeholder="Retail" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <Select disabled>
                <SelectTrigger id="categories">
                  <SelectValue placeholder="General" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="Phone number" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="border rounded-md p-4">
              <GoogleMapComponent onAddressChange={handleAddressChange} address={address} location={location} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your store" className="min-h-[100px]" />
          </div>
        </CardContent>
      </Card>

      {/* GALLERY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">GALLERY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Images and Videos</Label>
            <FileUpload
              onFilesSelected={handleGalleryUpload}
              accept="image/*,video/*"
              multiple={true}
              existingFiles={galleryFiles}
            />

            {galleryFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryFiles.map((file, index) => (
                  <Card key={index} className="p-2 relative">
                    <div className="aspect-square relative overflow-hidden rounded-md">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Gallery item ${index}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <video src={URL.createObjectURL(file)} className="max-w-full max-h-full" controls />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => {
                        const updatedFiles = [...galleryFiles]
                        updatedFiles.splice(index, 1)
                        setGalleryFiles(updatedFiles)
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* WORKING HOURS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">WORKING HOURS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {workingHours.map((hours, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-1/4">
                  <Label>{hours.day}</Label>
                </div>
                <div className="flex items-center gap-2 w-full md:w-3/4">
                  <TimePicker
                    value={hours.from}
                    onChange={(value) => handleWorkingHoursChange(index, "from", value)}
                    placeholder="From"
                    disabled={!hours.enabled}
                  />
                  <span className="mx-2">to</span>
                  <TimePicker
                    value={hours.to}
                    onChange={(value) => handleWorkingHoursChange(index, "to", value)}
                    placeholder="To"
                    disabled={!hours.enabled}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updatedHours = [...workingHours]
                      updatedHours[index].enabled = !updatedHours[index].enabled
                      setWorkingHours(updatedHours)
                    }}
                  >
                    {hours.enabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DELIVERY CHARGE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">DELIVERY CHARGE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="delivery-charge-per-km">Delivery Charges Per km</Label>
              <Input id="delivery-charge-per-km" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-delivery-charge">Minimum Delivery Charges</Label>
              <Input id="min-delivery-charge" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-delivery-within-km">Minimum Delivery Charges Within Km</Label>
              <Input id="min-delivery-within-km" type="number" min="0" step="0.1" placeholder="0.0" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BANK DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">BANK DETAILS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input id="bank-name" placeholder="Bank name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input id="branch-name" placeholder="Branch name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holder-name">Holder Name</Label>
              <Input id="holder-name" placeholder="Account holder name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input id="account-number" placeholder="Account number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-info">Other Information</Label>
            <Textarea id="other-info" placeholder="Any additional banking information" className="min-h-[80px]" />
          </div>
        </CardContent>
      </Card>

      {/* STORY */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">STORY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Choose humbling GIF/Image</Label>
              <FileUpload
                onFilesSelected={handleStoryImageUpload}
                accept="image/gif,image/*"
                multiple={false}
                existingFiles={storyImage ? [storyImage] : []}
              />

              {storyImage && (
                <div className="mt-2 max-w-xs">
                  <img
                    src={URL.createObjectURL(storyImage) || "/placeholder.svg"}
                    alt="Story image"
                    className="rounded-md max-h-40 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select Story Video</Label>
              <FileUpload
                onFilesSelected={handleStoryVideoUpload}
                accept="video/*"
                multiple={false}
                existingFiles={storyVideo ? [storyVideo] : []}
              />

              {storyVideo && (
                <div className="mt-2 max-w-md">
                  <video src={URL.createObjectURL(storyVideo)} controls className="rounded-md max-h-60 max-w-full" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Button type="submit" className="flex items-center gap-2">
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
    </form>
  )
}
