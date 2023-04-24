import React from 'react'
import Link from 'next/link'
import { FaUserAlt } from 'react-icons/fa'
import { AiFillHome, AiOutlinePlusCircle } from 'react-icons/ai'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()

  return (
    <>
      <div className="navbar bg-base-200 drop-shadow-sm ">
        <div className="flex-1">
          <Link href={"/"} className="btn btn-ghost normal-case text-xl"><AiFillHome /></Link>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <Link href={"/task/new"} tabIndex={0} className="btn btn-ghost btn-circle text-2xl">
              <AiOutlinePlusCircle />
            </Link>

          </div>
          <div className="dropdown dropdown-end">
            <Link href={"/login"} tabIndex={0} className="btn btn-ghost btn-circle avatar flex items-center justify-center">
              <FaUserAlt />
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="btm-nav fixed sm:hidden">
        <button type='button' onClick={() => router.push('/')} className={`${router.pathname === "/" && "active"}`}>
          <AiFillHome />
          <span className="btm-nav-label">Home</span>
        </button>
        <button type='button' onClick={() => router.push('/task/new')} className={`${router.pathname === "/new-task" && "active"}`}>
          <AiOutlinePlusCircle />
          <span className="btm-nav-label">Add</span>
        </button>
        <button type='button' onClick={() => router.push('/login')} className={`${router.pathname === "/login" && "active"}`}>
          <FaUserAlt />
          <span className="btm-nav-label">User</span>
        </button>
      </div> */}
    </>
  )
}
