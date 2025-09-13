import React, { useEffect, useState } from 'react';
import api from '../api/api';
import MarkdownIt from 'markdown-it';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
const md = new MarkdownIt();

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const res = await api.notes.getNotes();
                setNotes(res.data);
            } catch (error) {
                setError('Failed to fetch notes. Please try again.',error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (selectedNoteId) {
                await api.notes.updateNote(selectedNoteId, { title, content });
            } else {
                await api.notes.createNote({ title, content });
            }

            const res = await api.notes.getNotes();
            setNotes(res.data);
            setTitle('');
            setContent('');
            setSelectedNoteId(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save note. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (note) => {
        setContent(note.content);
        setTitle(note.title);
        setSelectedNoteId(note._id);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.notes.deleteNote(id);
                setNotes(notes.filter(note => note._id !== id));
            } catch (error) {
                setError('Failed to delete the note. Please try again.',error);
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Notes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 h-fit sticky top-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <PlusCircle size={24} className="text-blue-600" />
                        {selectedNoteId ? 'Edit Note' : 'Create New Note'}
                    </h2>
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note in Markdown..."
                            required
                            className="w-full h-56 px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setTitle('');
                                    setContent('');
                                    setSelectedNoteId(null);
                                }}
                                className="px-5 py-2 text-gray-600 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Note List</h2>
                    {loading && notes.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">Loading notes...</div>
                    ) : notes.length === 0 ? (
                        <div className="text-center p-8 text-gray-500">No notes found. Create your first note!</div>
                    ) : (
                        notes.map(note => (
                            <div key={note._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                                <div className="prose max-w-none text-gray-700 leading-relaxed overflow-hidden max-h-48" dangerouslySetInnerHTML={{ __html: md.render(note.content) }} />
                                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEditClick(note)}
                                        className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                        title="Edit Note"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(note._id)}
                                        className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                                        title="Delete Note"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;