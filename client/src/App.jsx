import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdAddTask, MdCheck, MdHourglassEmpty } from 'react-icons/md'
import { FaRegPenToSquare, FaTrash } from 'react-icons/fa6'
import AddTask from './components/AddTask'
import EditTask from './components/Edittask'

const Task = ({ task, toggleDone, deleteTask }) => {
  const [editOpen, setEditOpen] = useState(false);
  const toggleEditOpen = () => setEditOpen(!editOpen);

  return (
    <div className='h-14 w-[450px] bg-zinc-800/70 rounded-md flex flex-row items-center gap-3 px-4 relative'>
      <button onClick={() => toggleDone(task._id)}>
        { task.done ?
          <MdCheck size={23} color='green'/> :
          <MdHourglassEmpty size={22} color='fuchsia' />
        }
      </button>

      <p className={task.done ? 'line-through text-neutral-400' : undefined}> {task.name} </p>

      <div className='absolute right-3 flex flex-row gap-2'>
        <button
          className='h-full flex items-center p-2 rounded-md bg-red-700'
          onClick={() => deleteTask(task._id)}
        >
          <FaTrash size={16} />
        </button>

        <button
          className='h-full flex items-center p-2 rounded-md bg-blue-800'
          onClick={() => toggleEditOpen()}
        >
          <FaRegPenToSquare size={16} />
        </button>
      </div>

      <EditTask isOpen={editOpen} toggleEditOpen={toggleEditOpen} task={task} />
    </div>
  )
}

function App() {
  const [addOpen, setAddOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const toggleAddOpen = () => setAddOpen(!addOpen);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get('http://localhost:3000/api/tasks')
      setTasks(res.data.tasks);
    }

    getData();
  }, [setTasks, tasks])

  const toggleDone = (id) => {
    axios
      .put(`http://localhost:3000/api/tasks/${id}`, {
        done: !tasks.find(task => task._id === id).done,
        name: tasks.find(task => task._id === id).name
      })
      .then((res) => {
        setTasks(tasks.map(task => {
          if (task.id === id) {
            task.done = !task.done;
          }

          return task;
        }))
      })
  }

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:3000/api/tasks/${id}`)
      .then((res) => {
        setTasks(tasks.filter(task => task._id !== id));
      })
  }

  const pendingTasks = tasks.filter(task => !task.done);
  const completedTasks = tasks.filter(task => task.done);

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-start py-10  gap-10'>
      <h1 className='font-semibold text-2xl underline underline-offset-4'>
        To-Do App w/ CRUD
      </h1>
      
      <button className='px-3 py-2 flex flex-row items-center gap-2 border-[1px] rounded-md text-sm' onClick={toggleAddOpen}>
        <MdAddTask size={18} />
        Add Task
      </button>

      <div className='flex flex-col gap-2'>
        { pendingTasks.map((task, index) => (
          <div key={index}>
            <Task
              task={task}
              toggleDone={toggleDone}
              deleteTask={deleteTask}
            />
          </div>
        ))}
      </div>

      { completedTasks.length > 0 && <h2 className='font-semibold text-xl underline underline-offset-4 text-left'> Completed Tasks </h2> }
      
      <div className='flex flex-col gap-2'>
        { completedTasks.map((task, index) => (
          <div key={index}>
            <Task
              task={task}
              toggleDone={toggleDone}
              deleteTask={deleteTask}
            />
          </div>
        ))}
      </div>

      <AddTask isOpen={addOpen} toggleOpen={toggleAddOpen} />
    </div>
  )
}

export default App
