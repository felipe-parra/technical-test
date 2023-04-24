import GenericLayout from '@/components/layouts/GenericLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GenericLayout>
      <Component {...pageProps} />
    </GenericLayout>
  )
}
