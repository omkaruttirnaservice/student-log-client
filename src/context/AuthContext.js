import React, { createContext, useEffect, useState } from 'react'

// import jwt from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
	const [admin, setAdmin] = useState({})

	const setToken = async () => {
		const token = Cookies.get('token')
		if (token) {
			try {
				const decoded = await jwtDecode(token)
				setAdmin(decoded)
			} catch (error) {
				console.error('Error decoding token:', error)
			}
		}
	}

	useEffect(() => {
		setToken()
	}, [])

	const loginAdmin = async (token) => {
		try {
			const _admin = await jwtDecode(token)
			console.log('Decoded Token:', _admin)
			Cookies.set('token', token, { expires: 7 })
			setAdmin(_admin)
			toast.success(`Welcome ${_admin.name}`)
		} catch (error) {
			console.error('Error decoding token:', error)
		}
	}

	const logoutAdmin = () => {
		setAdmin(null)
		Cookies.remove('token')
	}

	return (
		<AuthContext.Provider value={{ admin, setAdmin, loginAdmin, logoutAdmin }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider
