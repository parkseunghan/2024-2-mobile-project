import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '../api/api';

const AdminScreen = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await fetchUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            loadUsers(); // 삭제 후 다시 로드
        } catch (error) {
            console.error('Failed to delete user', error);
        }
    };

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username} ({user.email}) - {user.role}
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminScreen;
