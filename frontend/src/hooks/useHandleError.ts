import { useState } from "react";

export default function useHandleError() {
  const [error, setError] = useState("");
  const handleError = (error: string) => {
    setError(error);
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  return {
    error,
    handleError,
  };
}
