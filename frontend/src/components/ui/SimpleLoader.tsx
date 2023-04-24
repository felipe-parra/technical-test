import React from 'react'

export default function SimpleLoader() {
  return (
    <section className='h-full w-full flex items-center justify-center'>
      <div className='border-4 border-separate border-r-4 border-r-white border-darkPrimary rounded-full w-8 h-8 animate-spin'></div>
    </section>
  )
}
