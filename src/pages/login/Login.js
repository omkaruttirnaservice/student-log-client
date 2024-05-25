import React, { useContext, useState } from 'react'
import './login.css'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import { object, string } from 'yup'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
	const { admin, loginAdmin } = useContext(AuthContext)

	const initialState = {
		email: '',
		password: '',
	}

	const [loginData, setLoginData] = useState(initialState)
	const navigate = useNavigate()

	// console.log(loginData)

	const handleChange = (e) => {
		setLoginData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	const loginSchema = object({
		password: string().required('Password is required'),
		email: string().email('Email is required').required('Email is required'),
	})

	const handleLogin = async (e) => {
		e.preventDefault()
		const url = `${process.env.REACT_APP_API_BASEURL}/auth/login`

		try {
			const userData = await loginSchema.validate(loginData)
			console.log(userData)

			const { data } = await axios.post(url, loginData)

			const { _success, _data } = data

			if (_success) {
				const { _token } = _data
				console.log(_token)

				loginAdmin(_token)

			
				navigate(`/dashboard`)
			}
		} catch (err) {
			let formError = err.errors[0]
			toast.error(formError)
			console.error(`Error : ${err}`)
		}
	}

	return (
		<div id="login-page">
			<div className="form-container">
				<form id="login-form">
					<h2>Login</h2>
					<div className="form">
						<div className="left">
							<input
								type="text"
								name="email"
								onChange={handleChange}
								value={loginData.username}
								placeholder="Enter your Email"
							/>

							<input
								type="password"
								name="password"
								onChange={handleChange}
								value={loginData.password}
								placeholder="Enter your password"
							/>

							<button
								className={
									'text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 '
								}
								type="button"
								onClick={handleLogin}
								id="login-teacher-btn"
							>
								Login
							</button>

							<div style={{ textAlign: 'center' }}>
								<p>Don't have an account?</p>
								<p className="text-sm">Forgot Username?</p>
								<p className="text-sm">Fogot Password ?</p>

								<NavLink
									className={
										'text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-6 block width-fit-content'
									}
									to={'/register'}
								>
									Register
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

export default Login
