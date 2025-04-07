import { useState, FormEvent } from "react";
import { socket } from '../../socket.ts';


type Props = { }

function CrateChat({}: Props) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        
        
        socket.timeout(5000).emit('join room', value, (err: any) => {
          if (err) {
            console.log('Error joining room, retrying...');
            // Retry logic can be implemented here if necessary
          }

          setIsLoading(false);
        });
    
        setValue("")
    }


  return (
    <form onSubmit={ onSubmit }>
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
  )
}

export default CrateChat