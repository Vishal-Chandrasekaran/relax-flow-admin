'use client';

import {useEffect, useRef, useState} from 'react';
import {AppSidebar} from '../../components/app-sidebar';
import {DashboardHeader} from '../../components/dashboard-header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  Camera,
  Loader2
} from 'lucide-react';
import SimpleReactValidator from 'simple-react-validator';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {showPasswordFn, toggleIconFn} from '@/lib/reusableFn';

export default function ProfilePage() {
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@relaxflow.com',
    phone: '+1 (555) 123-4567',
    bio: 'RelaxFlow platform administrator with expertise in sound therapy and meditation technologies.',
    location: 'San Francisco, CA'
  });
  const [countryCode, setCountryCode] = useState('us');

  // Security form state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validators
  const profileValidator = useRef(new SimpleReactValidator());
  const securityValidator = useRef(new SimpleReactValidator());
  const [profileForceUpdate, setProfileForceUpdate] = useState(0);
  const [securityForceUpdate, setSecurityForceUpdate] = useState(0);

  useEffect(() => {
    if (profileForm?.phone) {
      try {
        const phoneNumber: any = profileForm?.phone;
        if (phoneNumber) {
          setCountryCode(phoneNumber?.country);
        }
      } catch (error) {
        setCountryCode('us');
      }
    }
  }, [profileForm?.phone]);

  // Generic change handlers
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    setProfileForm((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setSecurityForm((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Form submission handlers
  const onProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileValidator.current.allValid()) {
      setIsProfileLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Profile updated:', profileForm);
      } catch (error) {
        console.error('Profile update error:', error);
      } finally {
        setIsProfileLoading(false);
      }
    } else {
      profileValidator.current.showMessages();
      setProfileForceUpdate(profileForceUpdate + 1);
    }
  };

  const onSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityValidator.current.allValid()) {
      setIsSecurityLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Password updated:', securityForm);
        setSecurityForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Password update error:', error);
      } finally {
        setIsSecurityLoading(false);
      }
    } else {
      securityValidator.current.showMessages();
      setSecurityForceUpdate(securityForceUpdate + 1);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className='flex-1 space-y-6 p-6'>
          {/* Page Header */}
          <div className='flex flex-col space-y-2'>
            <div className='flex items-center gap-2'>
              <User className='h-6 w-6' />
              <h1 className='text-3xl font-bold tracking-tight'>
                Profile Settings
              </h1>
            </div>
            <p className='text-muted-foreground'>
              Manage your account settings and preferences.
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-3'>
            {/* Profile Overview */}
            <Card className='lg:col-span-1'>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>
                  Your account information and status
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className='relative'>
                    <Avatar className='h-24 w-24'>
                      <AvatarImage
                        src='/placeholder-user.jpg'
                        alt='Admin User'
                      />
                      <AvatarFallback className='text-lg'>AU</AvatarFallback>
                    </Avatar>
                    <Button
                      size='icon'
                      variant='outline'
                      className='absolute -bottom-2 -right-2 h-8 w-8 rounded-full'
                    >
                      <Camera className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='text-center'>
                    <h3 className='text-lg font-semibold'>Admin User</h3>
                    <p className='text-sm text-muted-foreground'>
                      admin@relaxflow.com
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Account Status</span>
                    <Badge variant='default'>Active</Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>Role</span>
                    <Badge variant='destructive'>Administrator</Badge>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    <span>Joined January 2024</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Shield className='h-4 w-4' />
                    <span>Last login: Today at 2:30 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form and Settings */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onProfileSubmit} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex flex-col space-y-2'>
                        <label htmlFor='firstName' className='font-medium'>
                          First Name
                        </label>
                        <Input
                          id='firstName'
                          name='firstName'
                          type='text'
                          value={profileForm.firstName}
                          onChange={handleProfileChange}
                          placeholder='Enter first name'
                          className='input p-2 border border-gray-300 rounded'
                        />
                        <div style={{color: 'red'}}>
                          {profileValidator.current.message(
                            'firstName',
                            profileForm.firstName,
                            'required|min:2'
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col space-y-2'>
                        <label htmlFor='lastName' className='font-medium'>
                          Last Name
                        </label>
                        <Input
                          id='lastName'
                          name='lastName'
                          type='text'
                          value={profileForm.lastName}
                          onChange={handleProfileChange}
                          placeholder='Enter last name'
                          className='input p-2 border border-gray-300 rounded'
                        />
                        <div style={{color: 'red'}}>
                          {profileValidator.current.message(
                            'lastName',
                            profileForm.lastName,
                            'required|min:2'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex flex-col space-y-2'>
                        <label htmlFor='email' className='font-medium'>
                          Email Address
                        </label>
                        <div className='relative'>
                          <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                          <Input
                            id='email'
                            name='email'
                            type='email'
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            placeholder='Enter email'
                            className='input p-2 border border-gray-300 rounded pl-10'
                          />
                        </div>
                        <div style={{color: 'red'}}>
                          {profileValidator.current.message(
                            'email',
                            profileForm.email,
                            'required|email'
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col space-y-2'>
                        <label htmlFor='phone' className='font-medium'>
                          Phone Number
                        </label>
                        <div className='relative'>
                          <Phone className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                          <PhoneInput
                            value={profileForm.phone}
                            inputStyle={{paddingLeft: '40px'}}
                            placeholder='Phone Number'
                            country={countryCode}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoFocus: true,
                              className:
                                'input p-2 border border-gray-300 rounded pl-10 w-full'
                            }}
                            onChange={(phone) =>
                              setProfileForm({...profileForm, phone})
                            }
                          />
                        </div>
                        <div style={{color: 'red'}}>
                          {profileValidator.current.message(
                            'phone',
                            profileForm.phone,
                            'required|phone|min:10'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col space-y-2'>
                      <label htmlFor='location' className='font-medium'>
                        Location
                      </label>
                      <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                          id='location'
                          name='location'
                          type='text'
                          value={profileForm.location}
                          onChange={handleProfileChange}
                          placeholder='Enter location'
                          className='input p-2 border border-gray-300 rounded pl-10'
                        />
                      </div>
                      <div style={{color: 'red'}}>
                        {profileValidator.current.message(
                          'location',
                          profileForm.location,
                          'required'
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col space-y-2'>
                      <label htmlFor='bio' className='font-medium'>
                        Bio
                      </label>
                      <Textarea
                        id='bio'
                        name='bio'
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        placeholder='Tell us about yourself...'
                        className='min-h-[100px] input p-2 border border-gray-300 rounded'
                      />
                      <div style={{color: 'red'}}>
                        {profileValidator.current.message(
                          'bio',
                          profileForm.bio,
                          'max:500'
                        )}
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        disabled={isProfileLoading}
                        className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      >
                        {isProfileLoading ? (
                          <div className='flex items-center justify-center gap-2'>
                            <Loader2 className='animate-spin' />
                            <p>Saving...</p>
                          </div>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <form
                    onSubmit={onSecuritySubmit}
                    className='space-y-4'
                    data-np-intersection-state='visible'
                  >
                    <div className='flex flex-col space-y-2'>
                      <label htmlFor='currentPassword' className='font-medium'>
                        Current Password
                      </label>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                          id='currentPassword'
                          name='currentPassword'
                          type={showPasswordFn(showCurrentPassword)}
                          value={securityForm.currentPassword}
                          onChange={handleSecurityChange}
                          placeholder='Enter current password'
                          className='input p-2 border border-gray-300 rounded pl-10'
                        />
                        <Button
                          style={{
                            position: 'absolute',
                            left: '966px',
                            top: '0'
                          }}
                          variant='ghost'
                          size='icon'
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowCurrentPassword((prev) => !prev);
                          }}
                        >
                          {toggleIconFn(showCurrentPassword)}
                        </Button>
                      </div>
                      <div style={{color: 'red'}}>
                        {securityValidator.current.message(
                          'currentPassword',
                          securityForm.currentPassword,
                          'required|min:6'
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='flex flex-col space-y-2'>
                        <label htmlFor='newPassword' className='font-medium'>
                          New Password
                        </label>
                        <Input
                          id='newPassword'
                          name='newPassword'
                          type={showPasswordFn(showNewPassword)}
                          value={securityForm.newPassword}
                          onChange={handleSecurityChange}
                          placeholder='Enter new password'
                          className='input p-2 border border-gray-300 rounded'
                        />
                        <Button
                          style={{
                            position: 'absolute',
                            bottom:
                              securityValidator.current.message(
                                'newPassword',
                                securityForm.newPassword,
                                'required|min:6'
                              ) ||
                              securityValidator.current.message(
                                'confirmPassword',
                                securityForm.confirmPassword,
                                'required|min:6'
                              )
                                ? '600px'
                                : '580px',
                            left: '1050px',
                            right: '120px'
                          }}
                          variant='ghost'
                          size='icon'
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowNewPassword((prev) => !prev);
                          }}
                        >
                          {toggleIconFn(showNewPassword)}
                        </Button>
                        <div style={{color: 'red'}}>
                          {securityValidator.current.message(
                            'newPassword',
                            securityForm.newPassword,
                            'required|min:6'
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col space-y-2'>
                        <label
                          htmlFor='confirmPassword'
                          className='font-medium'
                        >
                          Confirm Password
                        </label>
                        <Input
                          id='confirmPassword'
                          name='confirmPassword'
                          type={showPasswordFn(showConfirmPassword)}
                          value={securityForm.confirmPassword}
                          onChange={handleSecurityChange}
                          placeholder='Confirm new password'
                          className='input p-2 border border-gray-300 rounded'
                        />
                        <Button
                          style={{position: 'absolute',bottom: securityValidator.current.message(
                            'newPassword',
                            securityForm.newPassword,
                            'required|min:6'
                          ) ||
                          securityValidator.current.message(
                            'confirmPassword',
                            securityForm.confirmPassword,
                            'required|min:6'
                          )
                            ? '600px'
                            : '580px',right:'50px'}}
                          variant='ghost'
                          size='icon'
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmPassword((prev) => !prev);
                          }}
                        >
                          {toggleIconFn(showConfirmPassword)}
                        </Button>
                        <div style={{color: 'red'}}>
                          {securityValidator.current.message(
                            'confirmPassword',
                            securityForm.confirmPassword,
                            `required|min:6|in:${securityForm.newPassword}`,
                            { messages: { in: 'Passwords need to match!' } }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        disabled={isSecurityLoading}
                        variant='outline'
                      >
                        {isSecurityLoading ? (
                          <div className='flex items-center justify-center gap-2'>
                            <Loader2 className='animate-spin' />
                            <p>Updating...</p>
                          </div>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                    </div>
                  </form>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className='space-y-4'>
                    <h4 className='text-sm font-medium'>
                      Two-Factor Authentication
                    </h4>
                    <div className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <div className='text-sm font-medium'>Enable 2FA</div>
                        <div className='text-xs text-muted-foreground'>
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <div className='flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        <div className='text-sm font-medium'>
                          Email Notifications
                        </div>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <div className='flex items-center gap-2'>
                        <Bell className='h-4 w-4' />
                        <div className='text-sm font-medium'>
                          Push Notifications
                        </div>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Receive push notifications in your browser
                      </div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
