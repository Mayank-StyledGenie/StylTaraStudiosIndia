"use client";

import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import Button from '../ui/Button';
import { FaGoogle } from 'react-icons/fa';

interface UserProfile {
  name: string;
  email: string;
  password: string;
  image?: string;
  mobile?: string;
  provider?: string;
  hasPassword?: boolean;
  connectedAccounts: {
    google?: boolean;
    facebook?: boolean;
    microsoft?: boolean;
  };
  notificationsEnabled: boolean;
}

// Define proper types for session.user with extended properties
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string;
  emailVerified?: Date;
  createdAt?: Date;
}

interface ExtendedSession {
  user: ExtendedUser;
  expires: string;
}

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    password: '********',
    image: '',
    mobile: '',
    connectedAccounts: {
      google: false,
      facebook: false,
      microsoft: false
    },
    notificationsEnabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    name: false,
    password: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching profile:', errorData);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();

      if (!data.email && session?.user?.email) {
        data.email = session.user.email;
      }

      if (!data.name && session?.user?.name) {
        data.name = session.user.name;
      }

      if (!data.image && session?.user?.image) {
        data.image = session.user.image;
      }

      setProfile({
        ...data,
        password: '********',
        name: data.name ?? '',
        email: data.email ?? '',
        image: data.image ?? '',
        mobile: data.mobile ?? '',
        connectedAccounts: {
          google: !!data.provider && data.provider === 'google',
          facebook: !!data.provider && data.provider === 'facebook',
          microsoft: !!data.provider && data.provider === 'azure-ad',
          ...data.connectedAccounts
        },
        notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true
      });
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);

      if (session?.user) {
        const extendedSession = session as unknown as ExtendedSession;
        const provider = extendedSession?.user?.provider ?? '';
        setProfile({
          name: session.user.name ?? '',
          email: session.user.email ?? '',
          password: '********',
          image: session.user.image ?? '',
          mobile: '',
          connectedAccounts: {
            google: provider === 'google',
            facebook: provider === 'facebook',
            microsoft: provider === 'azure-ad'
          },
          notificationsEnabled: true
        });
      } else {
        setErrorMessage('Failed to load your profile. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }

    if (status === 'authenticated' && session?.user) {
      fetchUserProfile();
    }
  }, [status, session, router, fetchUserProfile]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setIsLoading(true);
      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setProfile({
        ...profile,
        image: data.imageUrl
      });

      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = (field: 'name' | 'password') => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field]
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleNotificationToggle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/update-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationsEnabled: !profile.notificationsEnabled
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      setProfile({
        ...profile,
        notificationsEnabled: !profile.notificationsEnabled
      });

      setSuccessMessage('Notification preferences updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating notifications:', error);
      setErrorMessage('Failed to update notification preferences. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (field: 'name' | 'password') => {
    try {
      setIsLoading(true);

      const endpoint = field === 'name'
        ? '/api/user/update-profile'
        : '/api/user/change-password';

      const payload = field === 'name'
        ? { name: profile.name }
        : { password: profile.password };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      if (field === 'password') {
        setProfile({
          ...profile,
          password: '********'
        });
      }

      setIsEditing({
        ...isEditing,
        [field]: false
      });

      setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setErrorMessage(`Failed to update ${field}. Please try again.`);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/delete-account', {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        await signOut({ callbackUrl: '/' });
      } catch (error) {
        console.error('Error deleting account:', error);
        setErrorMessage('Failed to delete your account. Please try again later.');
        setIsLoading(false);
      }
    }
  };

  const handleDisconnectAccount = async (provider: 'google' | 'facebook' | 'microsoft') => {
    try {
      setIsLoading(true);

      const apiProvider = provider === 'microsoft' ? 'azure-ad' : provider;

      const response = await fetch('/api/user/disconnect-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: apiProvider })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? `Failed to disconnect ${provider} account`);
      }

      await fetchUserProfile();

      setSuccessMessage(`Successfully disconnected ${provider} account`);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error disconnecting account:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to disconnect account. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (isLoading && !profile.name) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {errorMessage}
        </div>
      )}

      <h2 className={`text-3xl font-bold text-gray-800 mb-8 mt-8 ${typography.heading.h2}`} style={{ color: colors.supporting.errieblack }}>Profile details</h2>

      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="flex flex-col mb-8">
          <div className="relative mb-6">
            {/* Fix accessibility: convert div to button with proper keyboard support */}
            <button
              className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
              onClick={handleImageClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick();
                }
              }}
              aria-label="Change profile picture"
            >
              {profile.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={profile.image}
                    alt="Profile"
                    className="object-cover"
                    fill
                    sizes="(max-width: 144px) 100vw"
                  />
                </div>
              ) : (
                <span className="text-gray-400 text-4xl">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                </span>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="profile-image-input"
              />
              <div className="flex mt-2 space-x-3 absolute top-13 left-0 right-0 justify-center">
                <button
                  className="text-sm bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-1 px-3 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick();
                  }}
                >
                  Change Photo
                </button>
                <button
                  className="text-sm bg-white hover:bg-gray-100 text-gray-900 py-1 px-3 rounded"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      setIsLoading(true);
                      const response = await fetch('/api/user/remove-image', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                      });

                      if (!response.ok) {
                        throw new Error('Failed to remove image');
                      }

                      setProfile({
                        ...profile,
                        image: ''
                      });

                      setSuccessMessage('Profile picture removed successfully!');
                      setTimeout(() => setSuccessMessage(''), 3000);
                    } catch (error) {
                      console.error('Error removing image:', error);
                      setErrorMessage('Failed to remove image. Please try again.');
                      setTimeout(() => setErrorMessage(''), 3000);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </button>
          </div>
          <div className="w-full md:w-1/2 mt-10">
            <div className="mb-6">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${typography.body.B2}`} htmlFor="name-input">
                <strong>Full Name</strong>
              </label>
              <div className="flex items-center">
                {isEditing.name ? (
                  <div className="flex-1 mr-2">
                    <input
                      type="text"
                      id="name-input"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-100 px-3 py-2 rounded-md mr-2">
                    {profile.name}
                  </div>
                )}

                {isEditing.name ? (
                  <button
                    onClick={() => handleSave('name')}
                    className="p-2 text-white bg-[#A7513D] hover:bg-[#A7513D] rounded-md px-5 ml-7"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditToggle('name')}
                    className="p-2 text-black hover:text-black-800 border border-black-800 rounded-md px-5 ml-7"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 ">
              <label className={`block text-sm font-bold text-gray-700 mb-1 ${typography.body.B2}`} htmlFor="password-input">
                <strong>Password</strong>
              </label>
              <div className="flex items-center">
                {isEditing.password ? (
                  <div className="flex-1 mr-2">
                    <input
                      type="password"
                      id="password-input"
                      name="password"
                      value={profile.password === '********' ? '' : profile.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-100 px-3 py-2 rounded-md mr-2">
                    {profile.password}
                  </div>
                )}

                {isEditing.password ? (
                  <button
                    onClick={() => handleSave('password')}
                    className="p-2 text-white bg-[#A7513D] hover:bg-[#A7513D] rounded-md px-5 ml-7"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditToggle('password')}
                    className="p-2 text-black hover:text-black-800 border border-black-800 rounded-md px-5 ml-7"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6 md:w-1/2">
              <label className={`block text-sm font-medium text-gray-700 mb-1 ${typography.body.B2}`} htmlFor="email-display">
                <strong>Email</strong>
              </label>
              <div id="email-display" className="px-0 py-2 rounded-md">
                {profile.email}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Log Out
        </Button>
        <hr className='mt-15 font-bold' />
      </div>

      <div className="bg-white rounded-lg mt-8 p-6 mb-8">
        <h2 className={`text-xl font-semibold text-gray-800 mb-4 ${typography.heading.h2}`} style={{ color: colors.supporting.errieblack }}>Connected accounts</h2>
        <p className={`mb-6 ${typography.body.B2}`}>Manage social media accounts linked to your profile for easy login.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaGoogle className="text-red-500 mr-3 text-xl" />
              <span>Google</span>
            </div>
            {profile.connectedAccounts.google ? (
              <div>
                <span className="text-green-600 text-sm font-medium mr-3">Connected</span>
                <button
                  onClick={() => handleDisconnectAccount('google')}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                  disabled={isLoading || (
                    profile.connectedAccounts.google &&
                    !profile.connectedAccounts.facebook &&
                    !profile.connectedAccounts.microsoft &&
                    !profile.hasPassword
                  )}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => signOut({ callbackUrl: '/api/auth/signin?callbackUrl=/profile&connect=google' })}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                style={{ color: colors.primary.darkpurple }}
                disabled={isLoading}
              >
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-xl font-semibold text-gray-800 ${typography.heading.h2}`} style={{ color: colors.supporting.errieblack }}>Notifications</h2>
          <label className="inline-flex items-center cursor-pointer" htmlFor="notifications-toggle" aria-label="Toggle notifications">
            <input
              id="notifications-toggle"
              type="checkbox"
              className="sr-only peer"
              checked={profile.notificationsEnabled}
              onChange={handleNotificationToggle}
              disabled={isLoading}
              style={{ backgroundColor: colors.primary.bone }}
            />
            <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer ${
              profile.notificationsEnabled ? 'peer-checked:after:translate-x-full peer-checked:bg-blue-600' : ''
            } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#401735] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all text-[#401735]`} style={{ backgroundColor: colors.primary.bone, color: colors.primary.darkpurple }}></div>
          </label>
        </div>
        <p className={`${typography.body.B2}`}>Receive notifications like newsletters, discount coupons, and style tips.</p>
        <hr className='mt-15 font-bold px-6' />
      </div>

      <div className="pt-8 mt-8 px-6 mb-10" style={{ color: colors.supporting.battleshipgrey }}>
        <Button
          onClick={handleDeleteAccount}
          variant="secondary"
          style={{ color: colors.supporting.battleshipgrey }}
          className="font-medium border border-[#8C8C8C] text-[#8C8C8C] py-2 px-4 rounded-md transition duration-200"
        >
          <strong>Delete Account</strong>
        </Button>

        <p className="mt-8 text-sm text-[#8C8C8C]">
          <span className="font-semibold">Note:</span> This action is permanent. Deleting your account will remove all data and cancel
          any active subscriptions. <button className="text-[#A7513D]">Contact us</button> if you need help.
        </p>
      </div>
    </div>
  );
};

export default Profile;