"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, Play, Pause, Volume2 } from "lucide-react"

// Simple React Validator
import SimpleReactValidator from 'simple-react-validator'

interface FormData {
  title: string
  duration: string
  category: string
  artist: string
  description: string
}

interface AddMeditationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMeditationDialog({ open, onOpenChange }: AddMeditationDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    duration: "",
    category: "",
    artist: "",
    description: "",
  })
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Initialize Simple React Validator with useRef
  const validator = useRef(new SimpleReactValidator({
    element: (message: string) => (
      <div className="text-sm text-red-500 mt-1">{message}</div>
    ),
    className: 'validation-error'
  }))

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validator.current.allValid()) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Creating meditation:", {
          ...formData,
          thumbnail: selectedThumbnail,
          audio: selectedAudio,
        })

        // Reset form and close dialog
        resetForm()
        onOpenChange(false)
      } catch (error) {
        console.error("Error creating meditation:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      validator.current.showMessages()
      // Force re-render to show validation messages
      setFormData({ ...formData })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      duration: "",
      category: "",
      artist: "",
      description: "",
    })
    setSelectedThumbnail(null)
    setSelectedAudio(null)
    setIsAudioPlaying(false)
    validator.current.hideMessages()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedThumbnail(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedAudio(e.target?.result as string)
        setIsAudioPlaying(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setSelectedThumbnail(null)
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = ""
    }
  }

  const removeAudio = () => {
    setSelectedAudio(null)
    setIsAudioPlaying(false)
    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
        setIsAudioPlaying(false)
      } else {
        audioRef.current.play().catch(() => {
          console.log("Audio playback failed")
        })
        setIsAudioPlaying(true)
      }
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Meditation</DialogTitle>
          <DialogDescription>
            Create a new music meditation for the RelaxFlow platform. Fill in all required fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title *
              </label>
              <input
                type="text"
                placeholder="Type here"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={() => validator.current.showMessageFor('title')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  validator.current.message('title', formData.title, 'required|min:2|max:100') ? 'border-red-500' : ''
                }`}
              />
              {validator.current.message('title', formData.title, 'required|min:2|max:100')}
            </div>

            {/* Duration Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Duration *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                onBlur={() => validator.current.showMessageFor('duration')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  validator.current.message('duration', formData.duration, 'required') ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select Duration</option>
                <option value="less-than-15">Less than 15 mins</option>
                <option value="15-30">15-30 mins</option>
                <option value="30-60">30-60 mins</option>
                <option value="greater-than-60">Greater than 60 mins</option>
              </select>
              {validator.current.message('duration', formData.duration, 'required')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                onBlur={() => validator.current.showMessageFor('category')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  validator.current.message('category', formData.category, 'required') ? 'border-red-500' : ''
                }`}
              >
                <option value="">Please select</option>
                <option value="relaxation">Relaxation</option>
                <option value="healing">Healing</option>
                <option value="meditation">Meditation</option>
                <option value="sleep">Sleep</option>
              </select>
              {validator.current.message('category', formData.category, 'required')}
            </div>

            {/* Artist Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Artist
              </label>
              <input
                type="text"
                placeholder="Type here"
                value={formData.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                onBlur={() => validator.current.showMessageFor('artist')}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  validator.current.message('artist', formData.artist, 'required|min:2|max:50') ? 'border-red-500' : ''
                }`}
              />
              {validator.current.message('artist', formData.artist, 'required|min:2|max:50')}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description *
            </label>
            <textarea
              placeholder="Type here"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => validator.current.showMessageFor('description')}
              className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                validator.current.message('description', formData.description, 'required|min:10|max:500') ? 'border-red-500' : ''
              }`}
            />
            {validator.current.message('description', formData.description, 'required|min:10|max:500')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Thumbnail *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selectedThumbnail ? (
                  <div className="relative">
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <Image
                        src={selectedThumbnail || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover rounded-lg"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        Change
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={removeThumbnail}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-600">Add Image</div>
                    <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>
                )}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Audio Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Audio *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selectedAudio ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-600">Audio Added</div>

                    {/* Audio Player Controls */}
                    <div className="flex items-center justify-center space-x-2 bg-gray-100 rounded-lg p-2">
                      <Button type="button" variant="ghost" size="sm" onClick={toggleAudioPlayback}>
                        {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1 h-1 bg-gray-300 rounded">
                        <div className="h-1 bg-pink-500 rounded" style={{ width: "30%" }}></div>
                      </div>
                      <Volume2 className="h-4 w-4 text-gray-500" />
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => audioInputRef.current?.click()}
                      >
                        Change
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={removeAudio}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {selectedAudio && (
                      <audio
                        ref={audioRef}
                        src={selectedAudio}
                        onEnded={() => setIsAudioPlaying(false)}
                        onPlay={() => setIsAudioPlaying(true)}
                        onPause={() => setIsAudioPlaying(false)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-pink-500 rounded mx-auto flex items-center justify-center">
                      <Volume2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-600">Add Audio</div>
                    <Button type="button" variant="outline" onClick={() => audioInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-br from-green-500 to-blue-500 p-6 text-white relative"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
