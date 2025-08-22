import React, { useEffect, useState, useMemo } from "react";
import api from "../api/api";
import FileUpload from "../components/FileUpload";
import TaskList from "../components/TaskList"; // New import
import HabitList from "../components/HabitList"; // New import
import { useNavigate } from "react-router-dom";
import { PlusCircle } from 'lucide-react';

const NewDashBoard = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [uploadImageUrl, setUploadImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                setFetchError(null);
                const res = await api.tasks.getTasks();
                if (Array.isArray(res.data)) {
                    setItems(res.data);
                } else if (res.data && Array.isArray(res.data.data)) {
                    setItems(res.data.data);
                } else {
                    console.error(`Backend response for /items was not an array: ${res.data}`);
                    setFetchError(`Unexpected data format from server. Please try again.`)
                    setItems([]);
                }
            } catch (error) {
                console.error(`Erorr fetching items: ${error}`);
                setFetchError(error.response?.data?.message || 'Failed to load items');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const { tasks, habits } = useMemo(() => {
        const tasks = items.filter(item => item.type === 'task');
        const habits = items.filter(item => item.type === 'habit');

    }, [items]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');

        if (!confirmDelete) return;

        const prevItems = items;
        setItems(items.filter(item => item._id !== id));
        // 
        try {
            await api.tasks.deleteTask(id);
        } catch (error) {
            console.error(`Delete failed ${error}`);
            setFetchError(error.response?.data?.message || `Failed to delete item.`);
            setItems(prevItems)
        }
    }

    const handleToggleComplete = async (itemToToggle) => {
        const updateItem = { ...itemToToggle, completed: !itemToToggle.completed };
        setItems((prev) => {
            prev.map((item) => {
                item._id === itemToToggle._id ? updateItem : item
            })
        })
    }
    const handleUploadSuccess = (filePath) => {
        setUploadedImageUrl(`http://localhost:3000${filePath}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="container mx-auto mt-8 text-center text-red-500 text-lg">
                Error: {fetchError}
            </div>
        );
    }

    return (
        <div>
        </div>
    )
}

export default NewDashBoard
