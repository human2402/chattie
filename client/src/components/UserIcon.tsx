import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

type Props = {
    isPrivate: boolean,
    className: string
}

export default function UserIcon({isPrivate, className = "mr-2 text-blue-500 py-[px]"}: Props) {
  
    if (isPrivate) {
        return (<FaUser className={className}/>)
    } else {
        return (<FaUsers className={className}/>)
    }
}