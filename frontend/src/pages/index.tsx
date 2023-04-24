import Head from 'next/head'
import { ITask } from '../interfaces/task.interface';
import { useEffect, useState } from 'react';
import { deleteTask, getAlltask } from '@/services/task.service';
import Toast from '@/components/ui/Toast';
import useHandleError from '@/hooks/useHandleError';
import SimpleLoader from '@/components/ui/SimpleLoader';
import { useRouter } from 'next/router';
import { BsPencilSquare, BsTrash } from 'react-icons/bs'
import Link from 'next/link';
import ModalComponent from '@/components/ui/Modal';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const { error, handleError } = useHandleError()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskId, setTaskId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<ITask[]>([])
  const router = useRouter()
  const getTasks = async () => {
    setIsLoading(true)
    const { error: ErrorResponse, data } = await getAlltask()
    console.log({ data, ErrorResponse })
    if (ErrorResponse) {
      handleError(ErrorResponse)
      return
    }
    setTasks(data)
    setIsLoading(false)
  }
  useEffect(() => {
    getTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdate = (id: number) => {
    if (!id) return
    router.push(`/task/${id}`)
  }

  const handleDelete = (id: number) => {
    if (!id) return
    setIsModalOpen(true)
    setTaskId(id)
  }

  const handleDeleteTask = async () => {
    if (!taskId) return

    const { error: ErrorResponse } = await deleteTask(taskId)
    if (ErrorResponse) {
      handleError(ErrorResponse)
      return
    }
    setIsModalOpen(false)
    getTasks()

  }
  return (
    <>
      <Head>
        <title>Task App</title>
        <meta name="description" content="Task appp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=''>
        <h1 className='text-3xl text-center'>
          Tasks List
        </h1>
        {
          isLoading && <SimpleLoader />
        }
        <section className='flex flex-wrap justify-start items-start'>
          {
            tasks.map(task => (
              <TaskItem key={task.id} task={task} onClickUpdate={handleUpdate} onClickDelete={handleDelete} />
            ))
          }
        </section>
        {
          error &&
          <Toast message={error} display={!error} type={'error'} />

        }
      </main>
      <ModalComponent open={isModalOpen} onClose={() => setIsModalOpen} >
        <section className='h-40 w-full p-3 flex flex-col justify-between'>
          <h3 className='text-xl'>Are you sure?</h3>
          <article className='w-full flex justify-evenly'>
            <button className='btn btn-error'
              onClick={handleDeleteTask}
            >Yes, delete</button>
            <button className='btn'
              onClick={() => setIsModalOpen(false)}
            >No, cancel</button>
          </article>
        </section>
      </ModalComponent>
    </>
  )
}


function TaskItem({ task, onClickUpdate, onClickDelete }: { task: ITask, onClickUpdate: (id: number) => void, onClickDelete: (id: number) => void }) {
  return (
    <section tabIndex={0} className='card h-44 md:max-w-xs w-full  m-1 bg-base-100 shadow-xl flex flex-col justify-start items-start'>
      <article className='text-xl font-bold collapse-title cursor-pointer'>
        <Link href={`/task/${task.id}`}>
          {task.title}
        </Link>
      </article>
      <article className="text-primary-content w-full px-2">
        <p className='text-sm h-16 overflow-auto'>{task.description}</p>
        <section className='w-full flex items-center justify-end m-2 h-10'>
          <button
            className='btn btn-info btn-sm'
            onClick={() => onClickUpdate(Number(task.id))}>
            <BsPencilSquare />
          </button>
          <button
            className='btn btn-error btn-sm m-1'
            onClick={() => onClickDelete(Number(task.id))}
          >
            <BsTrash />
          </button>
        </section>
      </article>
    </section>
  )
}