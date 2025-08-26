import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">URL Shortener</h2>
                    <p className="mt-2 text-sm text-gray-600">Enter a long URL to get a short one.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="url"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        placeholder="https://www.example.com/very/long/url"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !isAuthenticated}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Shortening...' : 'Shorten URL'}
                    </button>
                </form>
                
                {shortUrl && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 break-all">
                        <p className="text-sm font-semibold text-gray-700">Short URL:</p>
                        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{shortUrl}</a>
                    </div>
                )}

                {!isAuthenticated && (
                    <p className="text-center text-red-500 text-sm">You must be logged in to shorten URLs.</p>
                )}
            </div>
        </div>
    );
};

export default ShortenerPage;
