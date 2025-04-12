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
                    console.log(data)
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