"use client"

import { useState, useRef } from "react"
import SimpleReactValidator from 'simple-react-validator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "User",
    status: true, // true for active, false for inactive
  });

  const simpleValidator = useRef(new SimpleReactValidator())

  const handleClose = () => {
    onOpenChange(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked }:any = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simpleValidator.current.allValid()) {
      setIsLoading(true)
      try {
        // Handle form submission here
        console.log(form)
        handleClose()
      } catch (error) {
        console.error("Error creating user:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      simpleValidator.current.showMessages();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the RelaxFlow platform. Fill in all required fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="firstName" className="font-medium">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="input p-2 border border-gray-300 rounded"
            />
            {simpleValidator.current.message('firstName', form.firstName, 'required|alpha')}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="lastName" className="font-medium">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="input p-2 border border-gray-300 rounded"
            />
            {simpleValidator.current.message('lastName', form.lastName, 'required|alpha')}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="input p-2 border border-gray-300 rounded"
            />
            {simpleValidator.current.message('email', form.email, 'required|email')}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="role" className="font-medium">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="select p-2 border border-gray-300 rounded"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            {simpleValidator.current.message('role', form.role, 'required')}
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="status" className="font-medium">Status</label>
            <input
              id="status"
              name="status"
              type="checkbox"
              checked={form.status}
              onChange={handleChange}
              className="switch"
            />
            <span>{form.status ? "Active" : "Inactive"}</span>
            {simpleValidator.current.message('status', form.status, 'boolean')}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
