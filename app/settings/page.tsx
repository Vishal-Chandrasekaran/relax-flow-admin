"use client"

import { useState, useRef } from "react"
import SimpleReactValidator from 'simple-react-validator'
import { AppSidebar } from "../../components/app-sidebar"
import { DashboardHeader } from "../../components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showPasswordFn, toggleIconFn } from "@/lib/reusableFn"
import {
  Settings,
  Globe,
  Shield,
  Mail,
  Bell,
  Palette,
  Server,
  Loader2,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react"

export default function SettingsPage() {
  // Initialize simple-react-validator with custom styling
  const validator = useRef(new SimpleReactValidator({
    className: 'text-red-500 text-sm mt-1'
  }))
  
  // Loading states
  const [isGeneralLoading, setIsGeneralLoading] = useState(false)
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isSecurityLoading, setIsSecurityLoading] = useState(false)
  
  // UI states
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [systemNotifications, setSystemNotifications] = useState(true)
  
  // Password visibility states
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  
  // rerender states
  const [forceUpdate, setForceUpdate] = useState(0)
  
  // Form states
  const [generalForm, setGeneralForm] = useState({
    siteName: "RelaxFlow Admin",
    siteDescription: "Sound therapy and meditation platform administration",
    adminEmail: "admin@relaxflow.com",
    timezone: "America/Los_Angeles",
    language: "en",
    maintenanceMode: false,
  })
  
  const [emailForm, setEmailForm] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@relaxflow.com",
    smtpPassword: "",
    fromEmail: "noreply@relaxflow.com",
    fromName: "RelaxFlow",
  })
  
  const [securityForm, setSecurityForm] = useState({
    sessionTimeout: "30",
    maxLoginAttempts: "5",
    passwordMinLength: "8",
    requireTwoFactor: false,
    allowRegistration: false,
  })
  
  // Form handlers
  const handleGeneralChange = (field: string, value: string | boolean) => {
    setGeneralForm(prev => ({ ...prev, [field]: value }))
  }
  
  const handleEmailChange = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityForm(prev => ({ ...prev, [field]: value }))
  }
  
  // Submit handlers
  const onGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.current.allValid()) {
      setIsGeneralLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("General settings updated:", generalForm)
      } catch (error) {
        console.error("General settings update error:", error)
      } finally {
        setIsGeneralLoading(false)
      }
    } else {
      validator.current.showMessages()
      setForceUpdate(prev => prev + 1)
    }
  }
  
  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.current.allValid()) {
      setIsEmailLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Email settings updated:", emailForm)
      } catch (error) {
        console.error("Email settings update error:", error)
      } finally {
        setIsEmailLoading(false)
      }
    } else {
      validator.current.showMessages()
      setForceUpdate(prev => prev + 1)
    }
  }
  
  const onSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validator.current.allValid()) {
      setIsSecurityLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log("Security settings updated:", securityForm)
      } catch (error) {
        console.error("Security settings update error:", error)
      } finally {
        setIsSecurityLoading(false)
      }
    } else {
      validator.current.showMessages()
      setForceUpdate(prev => prev + 1)
    }
  }

  const handleBackupDatabase = () => {
    console.log("Starting database backup...")
  }
  
  const handleClearCache = () => {
    console.log("Clearing system cache...")
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            </div>
            <p className="text-muted-foreground">Configure and manage your RelaxFlow platform settings.</p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic platform settings and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onGeneralSubmit} className="space-y-4" data-np-autofill-form-type="identity" data-np-checked="1" data-np-watching="1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Site Name</label>
                        <Input
                          placeholder="Enter site name"
                          value={generalForm.siteName}
                          onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                          data-np-intersection-state="visible"
                        />
                        {validator.current.message('site_name', generalForm.siteName, 'required|min:2')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Admin Email</label>
                        <Input
                          type="email"
                          placeholder="Enter admin email"
                          value={generalForm.adminEmail}
                          onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                          data-np-intersection-state="visible"
                        />
                        {validator.current.message('admin_email', generalForm.adminEmail, 'required|email')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Description</label>
                      <Textarea
                        placeholder="Enter site description"
                        className="min-h-[100px]"
                        value={generalForm.siteDescription}
                        onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                      />
                      {validator.current.message('site_description', generalForm.siteDescription, 'required|max:500')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Timezone</label>
                        <Select value={generalForm.timezone} onValueChange={(value) => handleGeneralChange('timezone', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Language</label>
                        <Select value={generalForm.language} onValueChange={(value) => handleGeneralChange('language', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Maintenance Mode</div>
                        <div className="text-xs text-muted-foreground">
                          Enable to temporarily disable public access
                        </div>
                      </div>
                      <Switch
                        checked={generalForm.maintenanceMode}
                        onCheckedChange={(checked) => handleGeneralChange('maintenanceMode', checked)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isGeneralLoading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isGeneralLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>Configure SMTP settings for sending emails</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onEmailSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Host</label>
                        <Input
                          placeholder="smtp.gmail.com"
                          value={emailForm.smtpHost}
                          onChange={(e) => handleEmailChange('smtpHost', e.target.value)}
                        />
                        {validator.current.message('smtp_host', emailForm.smtpHost, 'required')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Port</label>
                        <Input
                          placeholder="587"
                          value={emailForm.smtpPort}
                          onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                        />
                        {validator.current.message('smtp_port', emailForm.smtpPort, 'required|numeric')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Username</label>
                        <Input
                          placeholder="username@domain.com"
                          value={emailForm.smtpUsername}
                          onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                        />
                        {validator.current.message('smtp_username', emailForm.smtpUsername, 'required')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Password</label>
                        <div className="relative">
                          <Input
                            type={showPasswordFn(showSmtpPassword)}
                            placeholder="••••••••"
                            value={emailForm.smtpPassword}
                            onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          >
                            {toggleIconFn(showSmtpPassword)}
                          </button>
                        </div>
                        {validator.current.message('smtp_password', emailForm.smtpPassword, 'required')}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Email</label>
                        <Input
                          type="email"
                          placeholder="noreply@relaxflow.com"
                          value={emailForm.fromEmail}
                          onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                        />
                        {validator.current.message('from_email', emailForm.fromEmail, 'required|email')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Name</label>
                        <Input
                          placeholder="RelaxFlow"
                          value={emailForm.fromName}
                          onChange={(e) => handleEmailChange('fromName', e.target.value)}
                        />
                        {validator.current.message('from_name', emailForm.fromName, 'required')}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline">
                        Test Connection
                      </Button>
                      <Button
                        type="submit"
                        disabled={isEmailLoading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Configuration</CardTitle>
                  <CardDescription>Manage security policies and authentication settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSecuritySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Session Timeout (minutes)</label>
                        <Input
                          placeholder="30"
                          value={securityForm.sessionTimeout}
                          onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                        />
                        {validator.current.message('session_timeout', securityForm.sessionTimeout, 'required|numeric')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Login Attempts</label>
                        <Input
                          placeholder="5"
                          value={securityForm.maxLoginAttempts}
                          onChange={(e) => handleSecurityChange('maxLoginAttempts', e.target.value)}
                        />
                        {validator.current.message('max_login_attempts', securityForm.maxLoginAttempts, 'required|numeric')}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Min Password Length</label>
                        <Input
                          placeholder="8"
                          value={securityForm.passwordMinLength}
                          onChange={(e) => handleSecurityChange('passwordMinLength', e.target.value)}
                        />
                        {validator.current.message('password_min_length', securityForm.passwordMinLength, 'required|numeric')}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Require Two-Factor Authentication</div>
                          <div className="text-xs text-muted-foreground">Force all users to enable 2FA</div>
                        </div>
                        <Switch
                          checked={securityForm.requireTwoFactor}
                          onCheckedChange={(checked) => handleSecurityChange('requireTwoFactor', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Allow User Registration</div>
                          <div className="text-xs text-muted-foreground">Allow new users to register accounts</div>
                        </div>
                        <Switch
                          checked={securityForm.allowRegistration}
                          onCheckedChange={(checked) => handleSecurityChange('allowRegistration', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSecurityLoading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isSecurityLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure system-wide notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <div className="text-sm font-medium">Email Notifications</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Send notifications via email</div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <div className="text-sm font-medium">Push Notifications</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Send browser push notifications</div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <div className="text-sm font-medium">System Alerts</div>
                      </div>
                      <div className="text-xs text-muted-foreground">Critical system notifications</div>
                    </div>
                    <Switch checked={systemNotifications} onCheckedChange={setSystemNotifications} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your admin dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Dark Mode</div>
                      <div className="text-xs text-muted-foreground">Switch to dark theme</div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme Color</label>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-purple-500"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-transparent"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-transparent"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 border-2 border-transparent"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>Current system status and information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Platform Version</span>
                      <Badge variant="outline">v2.1.0</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Database Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Storage Used</span>
                      <span className="text-sm text-muted-foreground">2.4 GB / 10 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Active Users</span>
                      <span className="text-sm text-muted-foreground">2,847</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Actions</CardTitle>
                    <CardDescription>Maintenance and backup operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={handleClearCache} variant="outline" className="w-full justify-start">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear System Cache
                    </Button>
                    <Button onClick={handleBackupDatabase} variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Backup Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                    <Separator />
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reset System
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
