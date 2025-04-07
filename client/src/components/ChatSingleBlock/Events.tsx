import { useEffect, useRef } from 'react';
import { MyForm } from './MyForm';

interface EventsProps {
  events: string[]; // The events prop should be an array of strings inline-block
}

export function Events({ events }: EventsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="flex flex-col w-full h-[88vh]">
      <ul className="list-none m-0 p-0 w-full overflow-y-auto flex-grow px-2">
      {
        events.map((event, index) =>
          <div className="flex w-full justify-end" key={ index }>
            <li className="shadow-md  py-2 px-4 bg-blue-100 mx-4 my-1  w-fit max-w-[75%] rounded-2xl" key={ index }>{ event }</li>
          </div>
        )
      }
      <div ref={bottomRef} />
      </ul>
      <MyForm />
    </div>
  );
}