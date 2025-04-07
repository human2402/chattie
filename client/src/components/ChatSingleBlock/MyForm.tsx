import { useState, FormEvent  } from 'react';
import { socket } from '../../socket.ts';

let counter = 0; 

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
  
    const clientOffset = `${socket.id}-${counter++}`; 

    socket.timeout(5000).emit('chat message', value, clientOffset, (err: any) => {
      if (err) {
        console.log('Error sending message, retrying...');
        // Retry logic can be implemented here if necessary
      }
      setIsLoading(false);
    });

    setValue("")
  }

  return (
    <div className='flex justify-center  inset-x-0 mx-auto w-full'>
      <form onSubmit={ onSubmit } className=' flex h-[11vh] box-border w-full max-w-[75%]'>
        <input 
          className=' border-0 custom-double-shadow px-4 py-2  bg-white grow rounded-xl m-2 focus:outline-0' 
          onChange={ e => setValue(e.target.value) } 
          value={ value }
        />

        <button 
          className='bg-gray-700 text-white px-3 rounded-xl my-2 mr-2  '
          type="submit"   
          disabled={ isLoading }
        >Submit</button>
      </form>
    </div>
  );
}