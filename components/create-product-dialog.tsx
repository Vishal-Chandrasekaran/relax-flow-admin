"use client"

import type React from "react"

import { useState, useRef } from "react"
import SimpleReactValidator from 'simple-react-validator'
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, X } from "lucide-react"

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const simpleValidator = useRef(new SimpleReactValidator())
  const [forceUpdate, setForceUpdate] = useState(0)

  const [form, setForm] = useState({
    name: "",
    deviceId: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    category: "therapy",
    isActive: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type }: any = e.target
    let val: any = value
    
    // Handle number inputs
    if (name === 'price' || name === 'stockQuantity') {
      val = type === 'number' ? Number(value) : value
    }
    
    setForm((prevState) => ({
      ...prevState,
      [name]: val
    }))

    // Trigger validation on change
    simpleValidator.current.showMessageFor(name)
    setForceUpdate(prev => prev + 1)
  }

  const handleSwitchChange = (checked: boolean) => {
    setForm((prevState) => ({
      ...prevState,
      isActive: checked
    }))

    // Trigger validation on change
    simpleValidator.current.showMessageFor('category');
    setForceUpdate(forceUpdate + 1);
  }

  const handleSelectChange = (value: string) => {
    setForm((prevState) => ({
      ...prevState,
      category: value
    }))

    // Trigger validation on change
    simpleValidator.current.showMessageFor('category');
    setForceUpdate(forceUpdate + 1);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (simpleValidator.current.allValid()) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Creating product:", { ...form, image: selectedImage })

        // Reset form and close dialog
        setForm({
          name: "",
          deviceId: "",
          description: "",
          price: 0,
          stockQuantity: 0,
          category: "therapy",
          isActive: true,
        })
        setSelectedImage(null)
        onOpenChange(false)
      } catch (error) {
        console.error("Error creating product:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      simpleValidator.current.showMessages()
      setForceUpdate(forceUpdate + 1)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    setForm({
      name: "",
      deviceId: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      category: "therapy",
      isActive: true,
    })
    setSelectedImage(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to the RelaxFlow catalog. Fill in all required fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="font-medium">
                Product Name
              </label>
              <Input 
                id="name"
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
              />
              <div style={{color: 'red'}}>
                {simpleValidator.current.message(
                  'name',
                  form.name,
                  'required|min:2|max:100'
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="deviceId" className="font-medium">
                Device ID
              </label>
              <Input 
                id="deviceId"
                name="deviceId"
                placeholder="e.g., RFB-001, HH-PRO-2024"
                value={form.deviceId}
                onChange={handleChange}
              />
              <div style={{color: 'red'}}>
                {simpleValidator.current.message(
                  'deviceId',
                  form.deviceId,
                  'required|min:3|max:50|regex:^[A-Za-z]+(-[A-Za-z]+)*-\\d+$'
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="category" className="font-medium">
                Category
              </label>
              <Select onValueChange={handleSelectChange} value={form.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
              <div style={{color: 'red'}}>
                {simpleValidator.current.message(
                  'category',
                  form.category,
                  'required|in:therapy,meditation,accessories,software'
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col space-y-2">
                <label htmlFor="price" className="font-medium">
                  Price ($)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price || ''}
                  onChange={handleChange}
                />
                <div style={{color: 'red'}}>
                  {simpleValidator.current.message(
                    'price',
                    form.price,
                    'required|numeric|between:0.01,9.99,num'
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="stockQuantity" className="font-medium">
                  Stock
                </label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  placeholder="0"
                  value={form.stockQuantity || ''}
                  onChange={handleChange}
                />
                <div style={{color: 'red'}}>
                  {simpleValidator.current.message(
                    'stockQuantity',
                    form.stockQuantity,
                    'required|numeric|between:1,1000,num'
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <Textarea 
              id="description"
              name="description"
              placeholder="Enter product description"
              className="min-h-[100px]"
              value={form.description}
              onChange={handleChange}
            />
            <div style={{color: 'red'}}>
              {simpleValidator.current.message(
                'description',
                form.description,
                'required|min:10|max:500'
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              {selectedImage ? (
                <div className="relative">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {selectedImage ? "Change Image" : "Upload Image"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Recommended: 400x400px, max 2MB</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Active Product
              </label>
              <div className="text-sm text-muted-foreground">Make this product available for purchase</div>
            </div>
            <Switch 
              checked={form.isActive} 
              onCheckedChange={handleSwitchChange} 
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}