import React from 'react'
import { createContext, useState } from 'react'
// TODO: match fields of context with how data is to be used
const UserContext = createContext({ userState: { isAuth: false, token: null, userId: null }, setUserState: () => { } })

export function UserContextProvider({ children }) {
    const [userState, setUserState] = useState({ isAuth: false, token: null, userId: null, email: null, name: null })
    const context = { userState, setUserState }

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>)
}

export default UserContext