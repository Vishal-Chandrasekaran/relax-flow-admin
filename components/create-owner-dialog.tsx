"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import SimpleReactValidator from "simple-react-validator"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowLeft, ArrowRight, Plus, X, Search, Check, Eye, EyeOff, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"

// Available products for Device ID dropdown
const availableProducts = [
  { id: "RFB-001", name: "RelaxFlow Sound Bowl Pro" },
  { id: "HH-PRO-2024", name: "Harmony Headphones" },
  { id: "VM-2024", name: "Vibration Therapy Mat" },
  { id: "MC-SET-01", name: "Meditation Cushion Set" },
  { id: "RFA-PREMIUM", name: "RelaxFlow Mobile App Premium" },
  { id: "TB-2024", name: "Therapy Bowl Advanced" },
  { id: "SC-PRO", name: "Sound Cushion Pro" },
  { id: "VH-LITE", name: "Vibration Headset Lite" },
  { id: "RF-MAT-XL", name: "RelaxFlow Mat XL" },
  { id: "ZEN-001", name: "Zen Meditation Kit" },
]

interface OwnerDetailsFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  confirmPassword?: string
}

interface LocationFormData {
  name: string
  deviceIds: string[]
}

interface LocationsFormData {
  locations: LocationFormData[]
}

interface CreateOwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MultiSelectDeviceProps {
  selectedDevices: string[]
  onDevicesChange: (devices: string[]) => void
  placeholder?: string
}

// Reusable Password Input Component
interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  showToggle?: boolean
  className?: string
  validator: SimpleReactValidator
  field: string
  validationRules: string
}

function PasswordInput({ 
  value, 
  onChange, 
  placeholder = "Enter password", 
  label = "Password",
  showToggle = true,
  className = "",
  validator,
  field,
  validationRules,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {validator.message(field, value, validationRules) && (
        <div className="text-sm text-red-600 mt-1">
          {validator.message(field, value, validationRules)}
        </div>
      )}
    </div>
  )
}

// Reusable Input Component with Validation
interface ValidatedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: string
  validator: SimpleReactValidator
  field: string
  validationRules: string
  customErrorMessage?: string
  className?: string
}

function ValidatedInput({ 
  value, 
  onChange, 
  placeholder = "", 
  label = "",
  type = "text",
  validator,
  field,
  validationRules,
  customErrorMessage,
  className = ""
}: ValidatedInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {validator.message(field, value, validationRules) && (
        <div className="text-sm text-red-600 mt-1">
          {customErrorMessage || validator.message(field, value, validationRules)}
        </div>
      )}
    </div>
  )
}

function MultiSelectDevice({
  selectedDevices,
  onDevicesChange,
  placeholder = "Select devices...",
}: MultiSelectDeviceProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (deviceId: string, event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()

    const newSelectedDevices = selectedDevices.includes(deviceId)
      ? selectedDevices.filter((id) => id !== deviceId)
      : [...selectedDevices, deviceId]

    onDevicesChange(newSelectedDevices)
  }

  const handleRemove = (deviceId: string) => {
    onDevicesChange(selectedDevices.filter((id) => id !== deviceId))
  }

  const handleSelectAll = (event?: React.MouseEvent) => {
    event?.preventDefault()
    event?.stopPropagation()

    if (selectedDevices.length === availableProducts.length) {
      onDevicesChange([])
    } else {
      onDevicesChange(availableProducts.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedDevices.length > 0 ? (
              <span className="text-left">
                {selectedDevices.length === 1
                  ? `${selectedDevices[0]} selected`
                  : `${selectedDevices.length} devices selected`}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search devices by ID or name..." />
            <CommandList>
              <CommandEmpty>No devices found.</CommandEmpty>
              <CommandGroup>
                <div
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground font-medium"
                  onClick={handleSelectAll}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedDevices.length === availableProducts.length ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {selectedDevices.length === availableProducts.length ? "Deselect All" : "Select All"}
                </div>
                <div className="border-t my-1" />
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex cursor-default select-none items-start gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => handleSelect(product.id, e)}
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 ${selectedDevices.includes(product.id) ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-sm">{product.id}</span>
                      <span className="text-xs text-muted-foreground">{product.name}</span>
                    </div>
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected devices display */}
      {selectedDevices.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Selected devices ({selectedDevices.length}):</div>
          <div className="flex flex-wrap gap-2">
            {selectedDevices.map((deviceId) => {
              const product = availableProducts.find((p) => p.id === deviceId)
              return (
                <Badge key={deviceId} variant="secondary" className="gap-1 pr-1">
                  <span className="font-medium">{deviceId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(deviceId)}
                    className="ml-1 hover:text-red-600 rounded-sm p-0.5 hover:bg-red-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function CreateOwnerDialog({ open, onOpenChange }: CreateOwnerDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsFormData | null>(null)
  const [countryCode, setCountryCode] = useState('us')
  
  // Form data state
  const [ownerFormData, setOwnerFormData] = useState<OwnerDetailsFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  
  const [locationsFormData, setLocationsFormData] = useState<LocationsFormData>({
    locations: [
      {
        name: "",
        deviceIds: [],
      },
    ],
  })

  // Validators
  const ownerValidator = useRef(new SimpleReactValidator())
  const locationsValidator = useRef(new SimpleReactValidator())

  useEffect(() => {
    if (ownerFormData?.phone) {
      try {
        const phoneNumber: any = ownerFormData?.phone;
        if (phoneNumber) {
          setCountryCode(phoneNumber?.country);
        }
      } catch (error) {
        setCountryCode('us');
      }
    }
  }, [ownerFormData?.phone]);

  const handleOwnerDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (ownerValidator.current.allValid()) {
      setOwnerDetails(ownerFormData)
      setCurrentStep(2)
    } else {
      ownerValidator.current.showMessages()
      // Force re-render
      setOwnerFormData({ ...ownerFormData })
    }
  }

  const handleLocationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (locationsValidator.current.allValid()) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log("Creating owner:", { ...ownerDetails, ...locationsFormData })

        // Reset forms and close dialog
        setOwnerFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        })
        setLocationsFormData({
          locations: [
            {
              name: "",
              deviceIds: [],
            },
          ],
        })
        setOwnerDetails(null)
        setCurrentStep(1)
        onOpenChange(false)
      } catch (error) {
        console.error("Error creating owner:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      locationsValidator.current.showMessages()
      // Force re-render
      setLocationsFormData({ ...locationsFormData })
    }
  }

  const addLocation = () => {
    setLocationsFormData({
      ...locationsFormData,
      locations: [
        ...locationsFormData.locations,
        {
          name: "",
          deviceIds: [],
        },
      ],
    })
  }

  const removeLocation = (index: number) => {
    if (locationsFormData.locations.length > 1) {
      setLocationsFormData({
        ...locationsFormData,
        locations: locationsFormData.locations.filter((_, i) => i !== index),
      })
    }
  }

  const handleDevicesChange = (locationIndex: number, devices: string[]) => {
    const updatedLocations = [...locationsFormData.locations]
    updatedLocations[locationIndex].deviceIds = devices
    setLocationsFormData({
      ...locationsFormData,
      locations: updatedLocations,
    })
  }

  const handleLocationNameChange = (locationIndex: number, name: string) => {
    const updatedLocations = [...locationsFormData.locations]
    updatedLocations[locationIndex].name = name
    setLocationsFormData({
      ...locationsFormData,
      locations: updatedLocations,
    })
  }

  const handleClose = () => {
    setOwnerFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })
    setLocationsFormData({
      locations: [
        {
          name: "",
          deviceIds: [],
        },
      ],
    })
    setOwnerDetails(null)
    setCurrentStep(1)
    onOpenChange(false)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const progress = (currentStep / 2) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
          <DialogDescription>
            Add a new device owner to the RelaxFlow platform. Complete all steps to create the owner profile.
          </DialogDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of 2</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </DialogHeader>

        {currentStep === 1 && (
          <form onSubmit={handleOwnerDetailsSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Owner Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ValidatedInput
                  value={ownerFormData.firstName}
                  onChange={(value) => setOwnerFormData({ ...ownerFormData, firstName: value })}
                  placeholder="Enter first name"
                  label="First Name"
                  validator={ownerValidator.current}
                  field="firstName"
                  validationRules="required|min:2"
                />

                <ValidatedInput
                  value={ownerFormData.lastName}
                  onChange={(value) => setOwnerFormData({ ...ownerFormData, lastName: value })}
                  placeholder="Enter last name"
                  label="Last Name"
                  validator={ownerValidator.current}
                  field="lastName"
                  validationRules="required|min:2"
                />
              </div>

              <ValidatedInput
                value={ownerFormData.email}
                onChange={(value) => setOwnerFormData({ ...ownerFormData, email: value })}
                placeholder="Enter email address"
                label="Email Address"
                type="email"
                validator={ownerValidator.current}
                field="email"
                validationRules="required|email"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Phone Number
                </label>
                <div>
                  <PhoneInput
                    value={ownerFormData.phone}
                    inputStyle={{paddingLeft: '40px'}}
                    placeholder="Phone Number"
                    country={countryCode}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                      className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    }}
                    onChange={(phone) => setOwnerFormData({...ownerFormData, phone})}
                  />
                </div>
                {ownerValidator.current.message('phone', ownerFormData.phone, 'required|phone|min:10') && (
                  <div className="text-sm text-red-600 mt-1">
                    {ownerValidator.current.message('phone', ownerFormData.phone, 'required|phone|min:10')}
                  </div>
                )}
              </div>

              <PasswordInput
                value={ownerFormData.password || ""}
                onChange={(value) => setOwnerFormData({ ...ownerFormData, password: value })}
                placeholder="Enter password"
                label="Password"
                validator={ownerValidator.current}
                field="password"
                validationRules="required|min:8"
              />

              <PasswordInput
                value={ownerFormData.confirmPassword || ""}
                onChange={(value) => setOwnerFormData({ ...ownerFormData, confirmPassword: value })}
                placeholder="Confirm password"
                label="Confirm Password"
                validator={ownerValidator.current}
                field="confirmPassword"
                validationRules={`required|in:${ownerFormData.password || ''}`}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleLocationsSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Location Management</h3>
                <Button type="button" variant="outline" size="sm" onClick={addLocation} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Location
                </Button>
              </div>

              {locationsFormData.locations.map((location, locationIndex) => (
                <div key={locationIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Location {locationIndex + 1}</h4>
                    {locationsFormData.locations.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocation(locationIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <ValidatedInput
                    value={location.name}
                    onChange={(value) => handleLocationNameChange(locationIndex, value)}
                    placeholder="Enter location name"
                    label="Location Name"
                    validator={locationsValidator.current}
                    field={`locations.${locationIndex}.name`}
                    validationRules="required|min:2"
                    customErrorMessage="The location name field is required"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Device IDs
                    </label>
                    <MultiSelectDevice
                      selectedDevices={location.deviceIds}
                      onDevicesChange={(devices) => handleDevicesChange(locationIndex, devices)}
                      placeholder="Search and select multiple devices..."
                    />
                                         {locationsValidator.current.message(`locations.${locationIndex}.deviceIds`, location.deviceIds, 'required') && (
                       <div className="text-sm text-red-600 mt-1">
                         The device ID field is required
                       </div>
                     )}
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Owner
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
