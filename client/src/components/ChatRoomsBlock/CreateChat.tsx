import { useState, FormEvent } from "react";
import { socket } from '../../socket.ts';
import { useAppContext } from "../../contexts/AppContext.tsx";


type Props = { }

function CreateChat({}: Props) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {setChatRoomID} = useAppContext ();

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        
        
        socket.timeout(5000).emit('join room', value, (err: any) => {
          if (err) {
            console.log('Error joining room, retrying...');
            // Retry logic can be implemented here if necessary
          }
          setChatRoomID (value)
          setIsLoading(false);
        });
        
        setValue("")
    }


  return (
    <form onSubmit={ onSubmit }>
       
    </form>
  )
}

export default CreateChat