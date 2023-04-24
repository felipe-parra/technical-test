import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getTaskById, updateTask } from '@/services/task.service';
import useHandleError from '@/hooks/useHandleError';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from '@/components/ui/Toast';

const TaskFormSchema = z.object({
  title: z.string().nonempty("Title is required")
    .min(1, "Title must be at least 1 characters")
    .max(100, "Title must be at most 100 characters")
  ,
  description: z.string().nonempty("Description is required").min(1, "Description must be at least 1 characters").max(1000, "Description must be at most 1000 characters")
})
type ValidationsSchema = z.infer<typeof TaskFormSchema>

export default function TaskPage() {
  const [taskId, setTaskId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { error, handleError } = useHandleError()
  const { register, handleSubmit, setValue, formState: { isValid, errors } } = useForm<ValidationsSchema>({
    resolver: zodResolver(TaskFormSchema)
  })
  const router = useRouter()
  const { query } = useRouter()
  useEffect(() => {
    if (!query["taskId"]) return
    const getTask = async () => {
      const { error: ErrorResponse, data } = await getTaskById(Number(query["taskId"]))
      console.log({ data, ErrorResponse })
      if (ErrorResponse || !data) {
        handleError("Task not found")
        return
      }
      setTaskId(data?.id || null)
      setValue("title", data.title)
      setValue("description", data.description)
    }
    getTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit: SubmitHandler<ValidationsSchema> = async (data) => {
    setIsLoading(true)
    if (!isValid || !taskId) {
      handleError('All fields are required')
      return
    }
    const res = await updateTask({ ...data, id: taskId })
    if (res.error) {
      handleError(res.error)
      return
    }
    setIsLoading(false)
    router.push('/')
  }
  return (
    <>
      {
        error && <p className='alert alert-error'>{error}</p>
      }
      {
        !taskId && <button className='btn btn-link absolute top-0 right-2' onClick={() => router.back()}>Go back</button>
      }
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center h-full w-full'>
        <label htmlFor="title" className="text-xl font-bold text-start w-full max-w-xs">Title
          <span className='text-xs font-thin mx-2'>
            (*Required)
          </span>
        </label>
        <input type="text" placeholder="Type the title" className="input input-bordered w-full max-w-xs my-1"
          {...register("title")}
        />
        {
          errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>
        }
        <label htmlFor="description" className="text-xl font-bold text-start w-full max-w-xs">Description <span className='text-xs font-thin mx-2'>
          (*Required)
        </span></label>
        <textarea placeholder="Type the description" className="input p-2 input-bordered w-full max-w-xs my-1" cols={3} rows={10}
          {
          ...register("description")
          }
        />
        {
          errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>
        }
        <button
          disabled={isLoading || !isValid}
          type="submit" className="btn btn-primary w-full max-w-xs my-3">Update</button>
      </form>
      {error &&
        <Toast message={error} display={!error} type={'error'} />
      }
    </>
  )
}
