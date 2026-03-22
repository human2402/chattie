import { useNavigate } from 'react-router';


export async function fetchGetCool (url: string, setData: (v: [any])=>void, setError:any, setLoading:(v: boolean)=>void)   {
                try {
                    const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                    });
            
                    if (!response.ok) {
                        if(response.status == 400) {
                            const navigate = useNavigate();
                            navigate('/login')
                        }
                        throw new Error("Failed to fetch");
                    }
            
                    const data = await response.json();
                    setData(data);
                } catch (error) {
                    setError("Failed to fetch data. Please try again.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

export async function fetchPostCool(newData: {any}, url: string, setError:any, setLoading:(v: boolean)=>void) {
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }, 
            body: JSON.stringify(newData),
          });
    
          const data = await response.json();
          
        if (!response.ok) {
            if(response.status == 400) {
                const navigate = useNavigate();
                navigate('/login')
            }
            throw new Error("Failed to fetch");
        }
        console.log("Response", data)
        return data;
    } catch (error) {
        setError("Failed to fetch data. Please try again.");
        console.error(error);
    } finally {
        setLoading(false);
    }
}

export async function justFetch(url: string) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
    
        if (!res.ok) throw new Error('Failed to get');
        console.log('✅ downloaded successfully');
    
        return res
    
        } catch (err) {
        console.error('❌ Error getting :', err);
        }
}

export function abbreviateName(fullName: string) {
    const parts = fullName.split(" ");
    if (parts.length < 2) {
      return fullName; // нет фамилии – возвращаем как есть
    }
    const firstName = parts[0];
    const lastNameLetter = parts[1][0]; // первая буква фамилии
    return `${firstName} ${lastNameLetter}`;
  }


// export async function sendFile(
//     file: File, 
//     currentRoomID: number, 
//     userID: number, 
//     socket,
//     authorName: string,
//     timestamp: string,
//     clientOffset: string
// ) {
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('roomID', currentRoomID);
//     formData.append('authorID', userID);
  
//     const res = await fetch('/api/upload-image', {
//       method: 'POST',
//       body: formData,
//     });
  
//     const data = await res.json();
//     console.log(data)

//     if (!socket) {
//         console.warn("Socket not ready yet");
//         return;
//       }
  
//     if (data.success) {
//         socket.emit(
//             'image message',
//             {
//               roomID: currentRoomID,
//               authorID: userID,
//               msg: fileName.name,
//               file: type: "file",
//               file: {
//                 name: file.name,      // 👈 filename
//                 type: file.type,
//                 size: file.size,
//                 data: base64,
//               },
//               authorName: authorName,
//               timestamp:timestamp,
//               clientOffset: clientOffset,
//               type: 'image',
//             },
//             (err: any) => {
//               if (err) {
//                 console.log('Error sending message, retrying...');
//                 // Optional: add retry logic here
//               }
//             }
//           );
//     }
//   }


export async function sendFile(
    file: File,
    currentRoomID: number,
    userID: number,
    socket: any,
    authorName: string,
    timestamp: string,
    clientOffset: string
  ) {
    const formData = new FormData();
    formData.append('file', file); // better to rename from 'image' to 'file' if it's general
    formData.append('roomID', String(currentRoomID));
    formData.append('authorID', String(userID));
  
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/upload-file', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      console.log(data);
  
      if (!socket) {
        console.warn("Socket not ready yet");
        return;
      }
  
      if (data.success && data.url) {
        socket.emit('chat message', {
          roomID: currentRoomID,
          authorID: userID,
          msg: file.name, // filename shown in chat
          file: {
            name: file.name,
            type: file.type,
            size: file.size,
            url: data.url, // returned by server
          },
          authorName,
          timestamp,
          clientOffset,
          type: 'file',
        }, (err: any) => {
          if (err) {
            console.log('Error sending message, retrying...');
          }
        });
      } else {
        console.error('Upload failed', data);
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  }