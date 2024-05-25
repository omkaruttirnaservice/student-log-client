import React, { useState } from 'react'
import { object, string, number, ref, date, InferType } from 'yup'

import './register.css'
import toast from 'react-hot-toast'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'

const Register = () => {
	const navigate = useNavigate()

	const initialState = {
		name: '',
		mobile: '',
		email: '',
		address: '',
		password: '',
		confirmPassword: '',
	}

	const [formData, setFormData] = useState(initialState)

	// console.log(formData)

	const handleChange = (e) => {
		setFormData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	const userSchema = object({
		confirmPassword: string()
			.oneOf([ref('password'), null], 'Passwords must match')
			.required('Confirm password is required'),
		password: string()
			.required('Password is required')
			.min(8, 'Password must be at least 8 characters long')
			.max(20, 'Password cannot be longer than 20 characters'),
		address: string()
			.required('Address is required')
			.min(5, 'Address must be at least 5 characters long')
			.max(100, 'Address cannot be longer than 100 characters'),
		email: string().email('Invalid email format').required('Email is required'),
		mobile: string()
			.matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
			.required('Mobile number is required'),
		name: string().required('Name is required'),
	})

	// console.log(process.env.REACT_APP_API_BASEURL)

	const handleSubmit = async (e) => {
		e.preventDefault()
		const url = `${process.env.REACT_APP_API_BASEURL}/admin/add`

		try {
			const userData = await userSchema.validate(formData)

			const { data } = await axios.post(url, userData)

			const { _success, _data, _message } = data

			if (_success) {
				toast.success('Registration successful')
				setFormData(initialState)
				navigate('/')
			}
		} catch (err) {
			let formError = err.errors[0]
			toast.error(formError)
			console.error(`Error : ${err}`)
		}
	}

	return (
		<div id="register-page">
			<div className="form-container">
				<form id="register-teacher-form">
					<h2>Register</h2>
					<div className="form">
						<div className="left">
							<input
								type="text"
								name="name"
								onChange={handleChange}
								value={formData.name}
								placeholder="Enter your name"
							/>
							<input
								type="text"
								name="mobile"
								onChange={handleChange}
								placeholder="Enter your mobile number "
								value={formData.mobile}
								maxLength={10}
							/>
							<input
								type="email"
								name="email"
								onChange={handleChange}
								value={formData.email}
								placeholder="Enter your email"
							/>
							<input
								type="text"
								name="address"
								onChange={handleChange}
								value={formData.address}
								placeholder="Enter your address"
							/>
							<input
								type="password"
								name="password"
								onChange={handleChange}
								value={formData.password}
								placeholder="Enter your password"
							/>
							<input
								type="password"
								name="confirmPassword"
								onChange={handleChange}
								value={formData.confirmPassword}
								placeholder="Confirm password"
							/>

							<button
								className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg"
								type="button"
								onClick={handleSubmit}
								id="register-teacher-btn"
							>
								Submit
							</button>

							<div style={{ textAlign: 'center' }}>
								Already Registered? {`   `}
								<NavLink
									className={
										'text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
									}
									to={'/'}
								>
									Login
								</NavLink>
							</div>
						</div>

						<div className="right">
							<img
								src="https://png.pngtree.com/thumb_back/fh260/back_our/20200702/ourmid/pngtree-cartoon-teacher-paper-plane-design-teachers-day-background-material-image_348527.jpg"
								alt=""
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Register
