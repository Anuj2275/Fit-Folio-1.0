import React, { useEffect, useState } from 'react'
import api from '../api/api';
// import { useAuth } from '../hooks/useAuth';
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

    useEffect(()=>{
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const res = await api.notes.getNotes();
                setNotes(res.data);
            } catch (error) {
                setError('Failed to fetch notes',error);
            } finally{
                setLoading(false);
            }
        }
        fetchNotes();
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if(selectedNoteId) await api.notes.updateNote(selectedNoteId,{title,content});
            else {
                await api.notes.createNote({title,content});
            }

            // refetching the notes after an action
            const res = await api.notes.getNotes();
            setNotes(res.data);
            setTitle('');
            setContent('');
            setSelectedNoteId(null);
        } catch (err) {
            setError('Failed to save note.',err)
        } finally{
            setLoading(false)
        }
    }

    const handleEditClick = async (note) => {
        setContent(note.content);
        setTitle(note.title);
        setSelectedNoteId(note._id);
    }

    const handleDeleteClick = async (id) => {
        if(window.confirm('Are you sure you want t delete this note?')){
            try {
                await api.notes.deleteNote(id);
                setNotes(notes.filter(note => note._id !== id));
            } catch (error) {
                setError('Failed to delete the note',error)
            }
        }
    }

  return (
    <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Notes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Note Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">{selectedNoteId ? 'Edit Note' : 'Create New Note'}</h2>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note in Markdown..."
                            required
                            className="w-full h-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setTitle('');
                                    setContent('');
                                    setSelectedNoteId(null);
                                }}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Note List & Preview */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
                    {notes.length === 0 && <p className="text-gray-500">No notes found.</p>}
                    {notes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: md.render(note.content) }} />
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => handleEditClick(note)} className="text-gray-500 hover:text-blue-500 transition-colors">
                                    <Edit size={20} />
                                </button>
                                <button onClick={() => handleDeleteClick(note._id)} className="text-gray-500 hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default NotesPage
