import { useState } from 'react'
import useHandleError from '@/hooks/useHandleError'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { signupApi } from '@/services/auth.service'

const SignupFormSchema = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  email: z.string().email('Please type a valid email'),
  password: z.string().min(8, { message: 'Must have at least 8 characters' }).max(128, { message: 'Must have a maximum of 128 characters' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is requried' })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
})

interface IFormField {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  type: string;
}

type ValidationsSchema = z.infer<typeof SignupFormSchema>

const SignupFormFields: IFormField[] = [
  {
    id: 'name',
    name: 'name',
    value: '',
    placeholder: 'Type your name',
    type: "text"
  },
  {
    id: 'email',
    name: 'email',
    value: '',
    placeholder: 'Type your email',
    type: "text"
  },
  {
    id: 'password',
    name: 'password',
    value: '',
    placeholder: 'Type your password',
    type: 'password'
  },
  {
    id: 'confirmPassword',
    name: 'confirmPassword',
    value: '',
    placeholder: 'Confirm password',
    type: 'password'
  }
]

export default function SignupPage() {
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<ValidationsSchema>({
    resolver: zodResolver(SignupFormSchema)
  })
  const { error: SignupError, handleError } = useHandleError()
  const [isLoading, setIsLoading] = useState(false)
  const handlerForm: SubmitHandler<ValidationsSchema> = async (data) => {
    console.log({ data })
    try {
      handleError("")
      setIsLoading(true)
      const res = await signupApi(data)
      if (res.error) throw new Error(res.error)
    } catch (error) {
      handleError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <section className='w-full h-full flex justify-center'>
      <form onSubmit={handleSubmit(handlerForm)} className='flex flex-col justify-center items-center w-full h-full py-2 rounded-lg bg-slate-700 drop-shadow max-w-lg'>
        <h1 className='text-2xl font-bold'>
          Signup
        </h1>
        {
          SignupFormFields.map(({ name, placeholder, type }, index) => (
            <article className='w-full max-w-xs' key={'form-group-key' + index}>
              <label htmlFor={name} className="text-lg font-bold text-start w-full max-w-xs capitalize">{name}
                <span className='text-xs font-thin mx-2'>
                  (*Required)
                </span>
              </label>
              <input
                className={`input input-bordered w-full max-w-xs ${errors[name as keyof ValidationsSchema] && "border-red-400"}`}
                type={type} placeholder={placeholder} {...register(name as keyof ValidationsSchema)} />
              {
                errors[name as keyof ValidationsSchema] && (
                  <p className='text-red-400 text-xs my-1'>{errors[name as keyof ValidationsSchema]?.message}</p>
                )
              }
            </article>
          ))
        }
        <button className='btn btn-primary w-full max-w-xs my-3' disabled={!isValid || isLoading}>Signup</button>
      </form>
    </section>
  )
}
