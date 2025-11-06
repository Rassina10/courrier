import { useEffect, useState } from "react"

type UserType = {
    id: number;
    name: string;
    email: string;
};

export default function User() {
    const [user, setUser] = useState<UserType[]>([]);

    const fetchData = () => {
        fetch('http://192.168.211.230:8000/api/users')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setUser(data.user);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <h1> les utilisateurs sont: </h1>
            <ul>
                {user.map((u) => (
                    <li key={u.id}>
                        {u.name} - {u.email}
                    </li>
                ))}
            </ul>
        </>
    );
}


    