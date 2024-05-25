import React, { useContext, useState } from 'react'

import './add-student-form.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { object, ref, string } from 'yup'
import _axios from '../../axiosInterceptor/_axios'
import { AuthContext } from '../../context/AuthContext'

const AddStudentForm = () => {
	const { admin } = useContext(AuthContext)

	const initialState = {
		sName: '',
		sMobile: '',
		sEmail: '',
		sAddress: '',
		tId: admin.userId,
	}

	const [studentData, setStudentData] = useState(initialState)

	const handleChange = (e) => {
		setStudentData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	const userSchema = object({
		sAddress: string()
			.required('Address is required')
			.min(5, 'Address must be at least 5 characters long')
			.max(100, 'Address cannot be longer than 100 characters'),
		sEmail: string()
			.email('Invalid email format')
			.required('Email is required'),
		sMobile: string()
			.matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
			.required('Mobile number is required'),
		sName: string().required('Name is required'),
	})

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			const _studentData = await userSchema.validate(studentData)

			const { data } = await _axios.post('/student/add', _studentData)

			const { _success, _data } = data

			if (_success) {
				toast.success('Student Added successfully')
				setStudentData(initialState)
			}
		} catch (err) {
			console.log(err)
			let showError = err.errors?.length
				? err.errors[0]
				: err.response.data._message
			toast.error(showError)
			console.log(`Error while saving the student data : ${err}`)
		}
	}

	return (
		<div id="add-student-component">
			<div className="form-container">
				<h1 className="text-center text-3xl mb-2">Add Student</h1>
				<form action="add-student-form">
					<div className="form">
						<input
							className=""
							type="text"
							name="sName"
							placeholder="Enter Student's Name"
							onChange={handleChange}
							value={studentData.sName}
						/>
						<input
							type="text"
							name="sMobile"
							onChange={handleChange}
							placeholder="Enter Student's Mobile Number"
							value={studentData.sMobile}
							maxLength={10}
						/>
						<input
							type="text"
							name="sEmail"
							placeholder="Enter Student's Email"
							onChange={handleChange}
							value={studentData.sEmail}
						/>
						<input
							type="text"
							name="sAddress"
							placeholder="Enter Student's Address"
							onChange={handleChange}
							value={studentData.sAddress}
						/>

						<input
							type="text"
							name="tId"
							onChange={handleChange}
							value={admin.userId}
							hidden
						/>

						<button
							className={
								'text-white  bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2'
							}
							onClick={handleSubmit}
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default AddStudentForm
