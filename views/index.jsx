export default function UserList() {
    return (
        <div>
            <h1>User List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, i) => (
                        <tr key={i}>
                            <td>{i}</td>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{user.title}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>
                                    Delete
                                </button>
                                <button onClick={() => updateUser(user)}>
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
