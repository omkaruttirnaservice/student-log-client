import React, { createContext, useContext, useState } from 'react'
import { AuthContext } from './AuthContext'
import _axios from '../axiosInterceptor/_axios'

export const StudentsContext = createContext()

const StudentsContextProvider = ({ children }) => {
	const { admin } = useContext(AuthContext)

	const [students, setStudents] = useState([])

	const handleFetchStudents = async () => {
		try {
			const { data } = await _axios.post('/student/list', {
				teacherId: admin.userId,
			})

			const { _success, _data } = data

			if (_success) {
				const { _students } = _data
				console.log(_students)
				setStudents(_students)
			}
		} catch (err) {
			console.log(`Error while fetching the student list : ${err}`)
		}
	}

	return (
		<StudentsContext.Provider
			value={{ students, setStudents, handleFetchStudents }}
		>
			{children}
		</StudentsContext.Provider>
	)
}

export default StudentsContextProvider
