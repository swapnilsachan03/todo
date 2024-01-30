import { useState } from "react"
import axios from "axios"
import Modal from './Modal'
import { FaImage, FaNoteSticky } from 'react-icons/fa6'

const AddTask = ({ isOpen, toggleOpen }) => {
  const [name, setName] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [image, setImage] = useState();

  const changeImageHandler = (event) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result ? (reader.result).toString() : "");
      setImage(file);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", image);

    await axios
      .post('http://localhost:3000/api/tasks', formData)
      .then((res) => {
        window.location.reload();
      })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        toggleOpen();
        setImagePrev("");
        setName("");
      }}
      modalHeader='Add Task'
    >
      <form onSubmit={(e) => onSubmit(e)} className='flex flex-col items-center justify-center gap-6 w-full'>
        <div />

        { imagePrev != "" && <img className='w-full object-cover rounded-xl' src={imagePrev} /> }

        <div className='flex flex-col items-center gap-2'>
          <input
            accept='image/*'
            type='file'
            id='avatar'
            className='hidden'
            onChange={changeImageHandler}
          />

          <button
            className='flex flex-row gap-2 py-1.5 px-2.5 text-sm items-center bg-teal-700 hover:bg-teal-800 rounded-md'
            type='button'
          >
            <FaImage />
            <label htmlFor="avatar" className='cursor-pointer'> Add Task Cover </label>
          </button>

          <p className='text-sm text-neutral-500 dark:text-neutral-400'>Only .jpg, .jpeg, .png files are allowed.</p>
        </div>

        <div className='flex flex-col gap-1.5 w-full'>
          <label className='text-xs font-semibold'> Task name </label>

          <input
            type="Name"
            placeholder="New task"
            className='w-full h-8 px-2 text-sm rounded-md bg-zinc-900/70 border-[1px] border-neutral-500 text-neutral-100'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='w-full flex flex-row justify-end gap-2'>
          <button
            className='flex flex-row gap-2 py-1.5 px-2.5 text-sm items-center bg-sky-700 hover:bg-sky-800 rounded-md'
            type='submit'
          >
            <FaNoteSticky />
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddTask
