import { useState, FormEvent  } from 'react';
import { socket } from '../../socket.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import getTimestamp from '../../contexts/GetTime.ts';

let counter = 0; 

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {user} = useAuth()
  const {chatRoomID} = useAppContext ()
  // console.log(user) 

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const authorName = `${user.firstName} ${user?.lastName}`
    const timestamp = getTimestamp() 

    if (value!='' && chatRoomID!= null && user?.firstName != undefined) {

      const clientOffset = `${socket.id}-${counter++}`; 
  
      socket.timeout(5000).emit(`chat message`, value, chatRoomID, user.id, authorName, timestamp, clientOffset, (err: any) => {
        if (err) {
          console.log('Error sending message, retrying...');
          // Retry logic can be implemented here if necessary
        }
        setIsLoading(false);
      });
    } else {console.error ("Ошибка отправки")}

    setValue("")
  }

  return (
    <div className='flex justify-center inset-x-0 mx-auto w-full'>
      <form onSubmit={ onSubmit } className='mx-3 flex h-13 box-border w-full max-w-[600px] mb-3'>
        <input 
          className=' border-0 custom-double-shadow px-4 py-2  bg-white grow rounded-xl mb-2 mx-2 focus:outline-0' 
          onChange={ e => setValue(e.target.value) } 
          value={ value }
        />

        <button 
          className='bg-gray-700 text-white px-3 rounded-xl mb-2 mr-2  '
          type="submit"   
          disabled={ isLoading }
        >Submit</button>
      </form>
    </div>
  );
}