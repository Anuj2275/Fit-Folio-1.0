import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Images, Trash2, Edit } from 'lucide-react';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const res = await api.files.getProfilePictures();
                setImages(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch images.');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await api.files.deleteProfilePicture(id);
                setImages(images.filter(img => img._id !== id));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete image.');
            }
        }
    };
    
    const handleEdit = (id) => {
        console.log(`Editing image with ID: ${id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600 font-medium animate-pulse">
                    Loading gallery...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-red-600 font-medium">Error: {error}</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-10">
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                    <Images size={36} className="text-blue-600" />
                    Your Image Gallery
                </h1>
                {images.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500 font-medium">No images uploaded yet.</p>
                        <p className="text-gray-400 mt-2">Upload some pictures from the Dashboard to see them here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map(image => (
                            <div key={image._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
                                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
                                    <img 
                                        src={`http://localhost:3000${image.filepath}`} 
                                        alt={image.filename} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="p-4 flex flex-col items-center">
                                    <p className="text-sm text-gray-600 font-medium truncate w-full text-center">{image.filename}</p>
                                    <div className="mt-4 flex gap-4">
                                        <button 
                                            onClick={() => handleEdit(image._id)}
                                            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                                            title="Edit Image"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(image._id)}
                                            className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryPage;