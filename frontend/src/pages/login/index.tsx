import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import useHandleError from "@/hooks/useHandleError";
import { loginApi } from "@/services/auth.service";
import SimpleLoader from "@/components/ui/SimpleLoader";
import { useRouter } from "next/router";

const LoginFormSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().nonempty("Password is required"),
});

type ValidationsSchema = z.infer<typeof LoginFormSchema>;

const LoginInputs = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Type your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Type your password",
  },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { error: ErrorLogin, handleError } = useHandleError()
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<ValidationsSchema>({
    resolver: zodResolver(LoginFormSchema),
  })
  const router = useRouter()

  const handlerForm: SubmitHandler<ValidationsSchema> = async (data) => {
    try {
      handleError("")
      setIsLoading(true)
      const res = await loginApi(data)
      if (res.error || !res.data) throw new Error(res.error)

      router.push('/')
    } catch (error) {
      handleError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="w-full h-full flex items-center justify-center">
      <form onSubmit={handleSubmit(handlerForm)} className='flex flex-col justify-center items-center w-full h-full py-2 rounded-lg bg-slate-700 drop-shadow max-w-lg'>
        <h1 className="text-2xl font-bold text-center w-full max-w-xs">Login</h1>
        {
          LoginInputs.map(({ name, placeholder, type }, index) => (
            <article className='w-full max-w-xs mt-1' key={'form-group-key' + index}>
              <label htmlFor={name} className="text-lg font-bold text-start w-full max-w-xs capitalize">{name}
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
        <p className="text-end w-full max-w-xs text-xs my-1">
          <span>{"Don't have an account?"}</span>
          <Link href='/signup' className="link link-primary mx-1">
            {"Signup"}
          </Link>
        </p>
        <section className="my-2">
          {
            isLoading && (
              <SimpleLoader />
            )
          }
        </section>
        <button className='btn btn-primary w-full max-w-xs' disabled={isLoading || !isValid}>Login</button>
      </form>
    </div>);
}
