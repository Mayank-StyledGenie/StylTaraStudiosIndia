"use client";
import Container from '@/components/ui/Container';
import React, { useState, useEffect } from 'react';


interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

export default function UserNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            
            const mockData: Notification[] = [
                
            ];
            
            setNotifications(mockData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            setLoading(false);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading notifications...</p>
            </div>
        );
    }

    return (
        <Container marginLeft='5vw' marginRight='5vw'>
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Notifications</h1>
            
            {notifications.length === 0 ? (
                <p className="text-xl text-gray-500">You have no notifications.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`p-4 border rounded-lg shadow-sm ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold">{notification.title}</h2>
                                <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                            </div>
                            <p className="mt-2">{notification.message}</p>
                            {!notification.read && (
                                <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
        </Container>
    );
}