import React, { ChangeEvent } from 'react'

type User = {
    id: number;
    first_name: string;
    // add other fields if needed
  };
  
  type Props = {
    users: User[];
    selectedUserIDs: number[];
    setSelectedUserIDs: React.Dispatch<React.SetStateAction<number[]>>;
  };

function UserSelector({users, selectedUserIDs, setSelectedUserIDs}: Props) {
    const handleCheckboxChange = (userId: number) => (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedUserIDs(prev => [...prev, userId]);
        } else {
            setSelectedUserIDs(prev => prev.filter(id => id !== userId));
        }
    };

    return (
        // <div className='mx-3 h-full overflow-y-auto py-2'>
        //         {users.map((item, index) =>(
        //         <div
        //              key={item.id} 
        //             className="px-2 py-2 rounded-sm hover:bg-gray-100 transition-colors flex items-center space-x-2"
        //         >
        //             <label htmlFor={`checkbox-${item.id}`} className='flex items-center space-x-2 cursor-pointe'>
        //                 <p>{item.first_name}</p>
        //                 <input
        //                     type="checkbox"
        //                     className='appearance-none h-5 w-5 border-2 border-blue-500 rounded-full checked:bg-blue-500 transition-colors cursor-pointer'
        //                     checked={selectedUserIDs.includes(item.id)}
        //                     onChange={handleCheckboxChange(item.id)}
        //                 />
        //             </label>
        //         </div>
        //         ))}
        //     </div>

        <div className='mx-3 h-full overflow-y-auto py-2'>
        {users.map((item, index) => (
            <label 
                key={item.id} htmlFor={`checkbox-${item.id}`} 
                className="px-2 py-2 rounded-sm hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
                <div className='grow'>
                    <p>{item.first_name} {item.middle_name} {item.last_name}</p>
                    <p className='text-sm text-gray-500'>{item.department} | {item.position}</p>
                </div>
                <input
                    id={`checkbox-${item.id}`}
                    type="checkbox"
                    className='appearance-none h-5 w-5 border-2 border-blue-500 rounded-full checked:bg-blue-500 transition-colors cursor-pointer'
                    checked={selectedUserIDs.includes(item.id)}
                    onChange={handleCheckboxChange(item.id)}
                />
            </label>
        ))}
    </div>
    )
}
// {
//     "id": 2,
//     "first_name": "Илья",
//     "middle_name": "Андреевич",
//     "last_name": "Прокопенко",
//     "position": "Звукарь",
//     "department": "Тех. поддержка."
// }
export default UserSelector