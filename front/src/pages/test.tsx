import { useEffect, useState } from "react"

export default function Tester(){

    const [users, setUsers] = useState();
    const fetchData =() =>{
        fetch('http://192.168.211.230:8000/api/me', {
            method:'GET',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type':'application/json'
            }
        })
            .then((response)=>{
                return response.json()
            })
            .then((data)=>{
                setUsers(data.user)
            })
    }
    useEffect(()=>{
        fetchData()
    },[])
    console.log(users)
    return(
    <>
        <h1>Liste des utilisateurs</h1>
        <ul>
                <li key={users?.id}>
                    {users?.name} - {users?.email}
                </li>
            
        </ul>
        {localStorage.getItem('token')}
    </>
    )
    
    
}