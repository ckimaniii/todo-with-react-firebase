import React, { useEffect, useState } from 'react'
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {db} from './firebase';


const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db,'todos'), (snapshot) => {
      setTodos(snapshot.docs.map((doc)=> ({id: doc.id, todo: doc.data().todo})));
    });
    return ()=> unsubscribe();

  }, []); 
  
  const addTodo = async()=>{
    try {
      if (input.trim() !== '') {
        // setTodos ([...todos,{id:new Date(), todo: input}]);
        await addDoc (collection(db, 'todos'), {todo:input});
        setInput("")
      }
      
    } catch (error) {
      console.error(error.message);
    }
  }

    // Edit Items
  const [editIndex, setEditIndex] = useState('-1');
    const setEdit = (index)=>{
      setInput(todos[index]. todo);
      setEditIndex(index);
    };

    const updateTodo = async () => {
      try {
        if (input.trim() !== '') {
          const todoDocRef = doc(db, 'todos', todos[editIndex].id);
          await updateDoc(todoDocRef, {todo:input});
          setEditIndex(-1);
          setInput('')
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    

    // Remove todo
    const removeTodo = async(id)=>{
     try {
      await deleteDoc(doc(db, 'todos', id));
     } catch (error) {
      console.error(error.message);
      
     }
    }


    

  return (
    <div className='font-abc min-h-screen flex flex-col gap-4 items-center justify-center p-4'>
      <div className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
      <h1 className='text-3xl font-bold text-dark text-center mb-4'>Todoo App</h1>

      <div className='flex gap-2'>
        <input onChange={(e)=> setInput(e.target.value)} type="text" value={input} placeholder='Enter a Task' className='w-full py-2 px-4 focus:outline-none border border-dark rounded-md' />
        <button onClick={editIndex === -1? addTodo : updateTodo} className='py-2 px-5 rounded-md bg-gradient-to-br from-blue_300 to-blue_800 text-white'>
       {editIndex === -1? 'Add' : 'Edit'} 
       </button>
      </div>

      </div>
      {
        todos.length > 0 && (
          <div className='bg-gray-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4'>
        <ul className='flex flex-col gap-10'>
          {todos.map((todo, index)=>(
            <li key={index} className='flex items-center justify-between'>
            <span className='text-lg'>{todo.todo}</span>
            <div>
            <DropdownMenu>
              <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
              <DropdownMenuContent>
    
                <DropdownMenuItem onClick={()=>setEdit(index)} className='text-green'>  <Pencil /> Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>removeTodo(todo.id)}>  <Trash2 /> Delete</DropdownMenuItem>
    
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            
          </li>
          )

          )}
          
        </ul>
      </div>
        )
      }
     
     
    </div>
  )
}

export default App