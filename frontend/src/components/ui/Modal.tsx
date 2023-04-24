import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalComponentProps {
  children: React.ReactNode
  open: boolean
  fullscreen?: boolean
  onClose: () => void
}

export default function ModalComponent({
  open,
  fullscreen = false,
  onClose,
  children
}: ModalComponentProps) {
  const handleClose = () => {
    onClose && onClose()
  }
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 500 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delayChildren: 0.5 }
        }}
        exit={{ opacity: 0, y: -500 }}
      >
        <Dialog
          unmount={false}
          open={open}
          onClose={handleClose}
          className='bg-darkPrimary bg-opacity-80 fixed z-30 inset-0 overflow-y-auto duration-200 transition-all overscroll-none'
          style={{ zIndex: '100' }}
        >
          <section className='flex w-full h-full justify-center items-center '>
            <Dialog.Overlay className='flex items-end bg-black bg-opacity-30 fixed bottom-0 inset-x-0 z-40 px-2 overflow-auto h-full' />
            <div
              className={`z-40 self-end card bg-slate-700 ${fullscreen ? 'h-full' : 'h-5/6'
                } flex flex-col items-strech justify-end w-full overflow-auto text-center shadow-xl rounded-t-2xl md:self-center md:rounded-xl md:h-auto md:w-full md:max-w-2xl md:flex md:items-center md:justify-center duration-200 ease-in-out`}
            >
              <div className='relative h-full md:h-auto w-full flex flex-col justify-between rounded-t-xl md:rounded-xl md:max-w-xl overflow-hidden'>
                {children}
              </div>
            </div>
          </section>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  )
}
