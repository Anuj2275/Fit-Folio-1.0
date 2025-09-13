import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import { LinkIcon } from 'lucide-react';

const ShortenerPage = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setShortUrl('');

        
        const fullUrl = longUrl.startsWith('http://') || longUrl.startsWith('https://')
            ? longUrl
            : `https://${longUrl}`;
        
        try {
            const res = await api.shortener.createShortUrl(fullUrl);
            setShortUrl(res.data.shortUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10 space-y-8">
                <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
                        <LinkIcon size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">URL Shortener</h2>
                    <p className="mt-2 text-base text-gray-600">Enter a long URL to create a short, shareable link.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="url"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            placeholder="https://www.example.com/very/long/url"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                        />
                    </div>
                    
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !isAuthenticated}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            'Shorten URL'
                        )}
                    </button>
                </form>
                
                {shortUrl && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-200 break-all text-center">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Your Short URL:</p>
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-lg font-medium hover:underline"
                        >
                            {shortUrl}
                        </a>
                    </div>
                )}

                {!isAuthenticated && (
                    <p className="text-center text-red-600 text-sm font-medium mt-4">
                        You must be logged in to shorten URLs.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ShortenerPage;