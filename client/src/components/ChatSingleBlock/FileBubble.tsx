import React from 'react'


function FileBubble({msg: string, size: string}) {
  return (
    <div>
        <p>{msg}</p>
        <p>{size}</p>
    </div>
  )
}

export default FileBubble