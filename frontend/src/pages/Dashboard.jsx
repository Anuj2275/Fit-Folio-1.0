import React, { useEffect, useState, useMemo } from "react";
import api from "../api/api"; 
import TaskCard from "../components/TaskCard"; 
import FileUpload from "../components/FileUpload"; 
import { useNavigate } from "react-router-dom"; 
import { PlusCircle, Zap, ListChecks } from 'lucide-react'; 

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  
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
            console.error("Backend response for /items was not an array:", res.data);
            setFetchError("Unexpected data format from server. Please try again.");
            setItems([]);
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        setFetchError(error.response?.data?.message || "Failed to load items.");
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
    return { tasks, habits };
  }, [items]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const prevItems = items;
    setItems(items.filter(item => item._id !== id));

    try {
      await api.tasks.deleteTask(id); 
      
    } catch (error) {
      console.error("Delete failed", error);
      setFetchError(error.response?.data?.message || "Failed to delete item.");
      setItems(prevItems);
    }
  };

  
  const handleToggleComplete = async (itemToToggle) => {
    
    const updatedItem = { ...itemToToggle, completed: !itemToToggle.completed };

    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemToToggle._id ? updatedItem : item 
      )
    );

    try {
      await api.tasks.updateTask(itemToToggle._id, { completed: updatedItem.completed });
    } catch (error) {
      console.error("Failed to update item status", error);
      setFetchError(error.response?.data?.message || "Failed to update item status.");
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemToToggle._id ? itemToToggle : item
        )
      );
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
            <p className="text-gray-500">Here's what you've got on your plate.</p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            <PlusCircle size={20} />
            Create New Item
          </button>
        </header>

        <div className="my-8 border p-6 rounded-lg bg-gray-100">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          {uploadedImageUrl && (
            <div className="mt-4 text-center">
              <p className="text-gray-700 mb-2">Last uploaded image preview:</p>
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="max-w-xs mx-auto rounded-lg shadow-md border border-gray-300"
              />
              <p className="text-sm text-gray-500 mt-1">Image served from: {uploadedImageUrl}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <ListChecks /> Tasks
            </h2>
            {tasks.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No tasks here. Add one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={() => handleDelete(task._id)}
                    onEdit={() => navigate(`/edit/${task._id}`)}
                    onToggleComplete={() => handleToggleComplete(task)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Zap /> Daily Habits
            </h2>
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              {habits.length > 0 ? (
                habits.map((habit) => (
                  <TaskCard
                    key={habit._id}
                    task={habit}
                    onDelete={() => handleDelete(habit._id)}
                    onEdit={() => navigate(`/edit/${habit._id}`)}
                    onToggleComplete={() => handleToggleComplete(habit)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">No habits defined. Add a new item and select 'habit'.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



/* OLD CODE BEFORE THE FILE UPLOADING FEATURE
// import React, { useEffect, useState, useMemo } from "react";
// import api from "../api/api";
// import TaskCard from "../components/TaskCard";
// import { useNavigate } from "react-router-dom";
// import { PlusCircle,Zap,ListChecks } from 'lucide-react'; // Using lucide-react for a clean icon
// import FileUpload from "../components/FileUpload";

// const Dashboard = () => {
//   const [items,setItems] = useState([]);

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetching tasks from the API
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await api.get('/items'); // Correctly fetching items
//         setTasks(res.data);
//       } catch (error) {
//         console.error("Error fetching tasks", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   // Handling the deletion of a task
//   const handleDelete = async (id) => {
//     try {
//       await api.delete(`/items/${id}`);
//       // Add a disappearing animation by adding a 'deleted' class
//       setTasks((prev) =>
//         prev.map((task) =>
//           task._id === id ? { ...task, deleted: true } : task
//         )
//       );
//       // Remove the task from the state after the animation
//       setTimeout(() => {
//         setTasks((prev) => prev.filter((task) => task._id !== id));
//       }, 500);
//     } catch (error) {
//       console.error("Delete failed", error);
//     }
//   };

//   // Display a loading spinner while fetching data
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
//             <p className="text-gray-500">Here's what you've got on your plate.</p>
//           </div>
//           <button
//             onClick={() => navigate('/create')}
//             className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
//           >
//             <PlusCircle size={20} />
//             Create Task
//           </button>
//         </header>

//         {tasks.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold text-gray-700">No tasks yet!</h2>
//             <p className="text-gray-500 mt-2">Click "Create Task" to get started.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {tasks.map((task) => (
//               <TaskCard
//                 key={task._id}
//                 task={task}
//                 onDelete={() => handleDelete(task._id)}
//                 onEdit={() => navigate(`/edit/${task._id}`)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// // import React, { useEffect, useState } from "react";
// // import { deleteItem, getItems } from "../api/api";
// // import TaskCard from "../components/TaskCard";
// // import { useNavigate } from "react-router-dom";

// // const Dashboard = () => {
// //   const [tasks, setTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchTasks = async () => {
// //       try {
        
// //         const res = await getItems();
// //         console.log('getting items',getItems());
// //         setTasks(res.data);
// //       } catch (error) {
// //         console.error("Error fetching tasks", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTasks();
// //   }, []);

// //   const handleDelete = async (id) => {
// //     try {
// //       await deleteItem(id);
// //       setTasks((prev) => prev.filter((task) => task._id !== id));
// //     } catch (error) {
// //       console.error("Delete failed", error);
// //     }
// //   };

// //   if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
// //   return (
// //      <div className="max-w-3xl mx-auto px-4 py-6">
// //       <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
// //       {tasks.length === 0 ? (
// //         <p className="text-center text-gray-500">No tasks found. Go create one!</p>
// //       ) : (
// //         <div className="space-y-4">
// //           {tasks.map((task) => (
// //             <TaskCard
// //               key={task._id}
// //               task={task}
// //               onDelete={() => handleDelete(task._id)}
// //               onEdit={() => navigate(`/edit/${task._id}`)}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // };

// // export default Dashboard;
*/

// // frontend/src/pages/Dashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import api from "../api/api";
// import TaskCard from "../components/TaskCard";
// import HabitRow from "../components/HabitRow"; // New component for habits
// import { useNavigate } from "react-router-dom";
// import { PlusCircle, Zap, ListChecks } from 'lucide-react';

// const Dashboard = () => {
  //   const [items, setItems] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const navigate = useNavigate();
  
  //   useEffect(() => {
    //     const fetchItems = async () => {
      //       try {
        //         setLoading(true)
        //         const res = await api.get('/items');
        //         if(Array.isArray(res.data)){
          //           setItems(res.data);
          //         }else if (res.data && Array.isArray(res.data.data)) { // If your backend ever wraps it in a 'data' key
          //         setItems(res.data.data);
          //       } else {
            //         // Fallback for unexpected response structure
            //         console.error("Backend response for /items was not an array:", res.data);
            //         setItems([]); 
            //       }
            //       } catch (error) {
              //         console.error("Error fetching items", error);
              //       } finally {
                //         setLoading(false);
                //       }
                //     };
                //     fetchItems();
                //   }, []);
                
                //   // Memoize the filtering of tasks and habits to prevent re-calculation on every render
                //   const { tasks, habits } = useMemo(() => {
                  //     const tasks = items.filter(item => item.type === 'task');
                  //     const habits = items.filter(item => item.type === 'habit');
                  //     return { tasks, habits };
                  //   }, [items]);
                  
                  
                  //   const handleDelete = async (id) => {
                    //     try {
                      //       await api.delete(`/items/${id}`);
                      //       setItems((prev) => prev.map(item => item._id === id ? { ...item, deleted: true } : item));
                      //       setTimeout(() => {
                        //         setItems((prev) => prev.filter((item) => item._id !== id));
                        //       }, 500);
                        //     } catch (error) {
                          //       console.error("Delete failed", error);
                          //     }
                          //   };
                          
                          //   const handleToggleComplete = async (itemToToggle) => {
                            //     try {
                              //       const updatedItem = { ...itemToToggle, completed: !itemToToggle.completed };
                              //       setItems((prevItems) =>
                                //         prevItems.map((item) =>
                                  //           item._id === itemToToggle._id ? updatedItem : item
//         )
//       );
//       await api.put(`/items/${itemToToggle._id}`, { completed: updatedItem.completed });
//     } catch (error) {
  //       console.error("Failed to update item status", error);
  //       setItems((prevItems) =>
    //         prevItems.map((item) =>
      //           item._id === itemToToggle._id ? itemToToggle : item
  //         )
  //       );
  //     }
  //   };
  
  //   if (loading) {
    //     return (
      //       <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      //         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      //       </div>
      //     );
      //   }
      
      //   return (
        //     <div className="container mx-auto px-4 py-8">
        //       <header className="flex justify-between items-center mb-8">
        //         <div>
        //           <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
        //           <p className="text-gray-500">Here's what you've got on your plate.</p>
        //         </div>
        //         <button
        //           onClick={() => navigate('/create')}
        //           className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        //         >
        //           <PlusCircle size={20} />
        //           Create New Item
        //         </button>
        //       </header>
        
        //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        //         {/* Tasks Section (takes up 2/3 of the space on large screens) */}
        //         <div className="lg:col-span-2">
        //             <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2"><ListChecks /> Tasks</h2>
        //             {tasks.length > 0 ? (
          //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          //                 {tasks.map((task) => (
            //                     <TaskCard
            //                     key={task._id}
            //                     task={task}
            //                     onDelete={() => handleDelete(task._id)}
            //                     onEdit={() => navigate(`/edit/${task._id}`)}
            //                     onToggleComplete={() => handleToggleComplete(task)}
            //                     />
            //                 ))}
            //                 </div>
            //             ) : (
              //                 <div className="text-center py-10 bg-white rounded-lg shadow-md">
              //                     <p className="text-gray-500">No tasks here. Add one!</p>
              //                 </div>
              //             )}
              //         </div>
              
              //         {/* Habits Section (takes up 1/3 of the space on large screens) */}
              //         <div className="lg:col-span-1">
              //             <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Zap /> Daily Habits</h2>
              //             <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              //                 {habits.length > 0 ? (
                //                     habits.map((habit) => (
                  //                         <HabitRow
                  //                             key={habit._id}
                  //                             habit={habit}
                  //                             onDelete={() => handleDelete(habit._id)}
                  //                             onEdit={() => navigate(`/edit/${habit._id}`)}
                  //                             onToggleComplete={() => handleToggleComplete(habit)}
                  //                         />
                  //                     ))
                  //                 ) : (
//                     <p className="text-center text-gray-500 py-6">No habits defined. Add a new item and select 'habit'.</p>
//                 )}
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Dashboard;