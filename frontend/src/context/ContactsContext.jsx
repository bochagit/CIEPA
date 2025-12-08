import * as React from 'react'
import { contactService } from '../services/contactService'

const ContactsContext = React.createContext()

export function ContactsProvider({ children }) {
    const [unreadCount, setUnreadCount] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchUnreadCount = React.useCallback(async () => {
        try {
            const response = await contactService.getUnreadCount()
            setUnreadCount(response.count || 0)
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching unread count:', error)
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchUnreadCount()
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000)
        return () => clearInterval(interval)
    }, [fetchUnreadCount])

    const value = React.useMemo(() => ({
        unreadCount,
        refreshUnreadCount: fetchUnreadCount,
        isLoading
    }), [unreadCount, fetchUnreadCount, isLoading])

    return (
        <ContactsContext.Provider value={value}>
            {children}
        </ContactsContext.Provider>
    )
}

export function useContacts() {
    const context = React.useContext(ContactsContext)
    if (!context) {
        throw new Error('useContacts must be used within ContactsProvider')
    }
    return context
}
