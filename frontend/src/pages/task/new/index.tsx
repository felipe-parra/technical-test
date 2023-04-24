import React, { useState } from 'react'
import Toast from '@/components/ui/Toast'
import { createTask } from '@/services/task.service'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const TaskFormSchema = z.object({
  title: z.string().nonempty("Title is required")
    .min(1, "Title must be at least 1 characters")
    .max(100, "Title must be at most 100 characters")
  ,
  description: z.string().nonempty("Description is required").min(1, "Description must be at least 1 characters").max(1000, "Description must be at most 1000 characters")
})
type ValidationsSchema = z.infer<typeof TaskFormSchema>

export default function CreateTaskPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<ValidationsSchema>({
    resolver: zodResolver(TaskFormSchema)
  })

  const router = useRouter()
  const handleError = (error = "") => {
    setError(error)
    setTimeout(() => {
      setError("")
    }, 3000)
  }
  const onSubmit: SubmitHandler<ValidationsSchema> = async (data) => {
    if (!isValid) {
      handleError('All fields are required')
      return
    }
    const res = await createTask(data)
    if (res.error) {
      handleError(res.error)
      return
    }
    setIsLoading(true)
    router.push('/')
  }
  return (
    <section className='w-full h-full flex flex-col justify-start items-center'>
      <h1 className='text-2xl font-bold text-center w-full'>
        Create Task
      </h1>
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
          type="submit" className="btn btn-primary w-full max-w-xs my-3">Create</button>
      </form>
      {error &&
        <Toast message={error} display={!error} type={'error'} />
      }
    </section>
  )
}
