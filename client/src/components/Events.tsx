interface EventsProps {
  events: string[]; // The events prop should be an array of strings
}

export function Events({ events }: EventsProps) {
  return (
    <ul>
    {
      events.map((event, index) =>
        <li key={ index }>{ event }</li>
      )
    }
    </ul>
  );
}