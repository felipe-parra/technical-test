import { useState, useEffect } from 'react';

interface Props {
  message: string;
  display: boolean;
  type: "success" | "info" | "error";
}

export default function Toast({ message, display, type = "error" }: Props) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (display) {
      setShow(true)
    }
  }, [display])

  return (
    <div className="toast toast-end">
      {/* <div className={`alert alert-error`}> */}
      <div className={`alert alert-${type}`}>
        <div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  )
}
