import React from 'react'
import Navbar from '../ui/Navbar'

export default function GenericLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className='container mx-auto h-full w-full p-3 relative'>
        {children}
      </main>
    </>
  )
}
