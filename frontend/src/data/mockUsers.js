export const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'prueba123',
        name: 'Administrador',
        role: 'admin'
    }
]

export const authenticateUser = (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password)
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword
    }
    return null;
}