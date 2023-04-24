import React, { useState } from 'react'

export default function useHandleLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const handleLoading = (loading: boolean) => {
    setIsLoading(loading)
  }
  return {
    isLoading,
    handleLoading,
  }
}
