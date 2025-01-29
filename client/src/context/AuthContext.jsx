import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ROUTES } from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch(API_ROUTES.AUTH.VERIFY, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Verification failed');
                }
                
                const data = await response.json();
                setIsAuthenticated(data.success);
            } catch (error) {
                console.error('Auth verification error:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated
    };

    if (isLoading) {
        return (
            <div className='text-left'>
                <div className="loader w-14 aspect-[2] bg-custom-gradient bg-no-repeat bg-[length:calc(100%/3)_50%] animate-l3">
                </div>
            </div>   
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

