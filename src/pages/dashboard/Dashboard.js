import React, { useContext } from 'react'
import './dashboard.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const Dashboard = () => {
	const navigate = useNavigate()

	const { admin, logoutAdmin } = useContext(AuthContext)

	const handleLogout = async (e) => {
		e.preventDefault()
		await logoutAdmin()
		navigate('/')
	}

	return (
		<div id="dashboard-page">
			<nav className="py-3  backdrop-blur text-white bg-slate-900 sticky">
				<div className="container dashboard-container">
					<div className="left">
						<div>
							<NavLink className={'font-bold'} to={`/dashboard`}>
								Home
							</NavLink>
						</div>
					</div>
					<div className="right">
						<div className="profile-container">
							<img
								src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
								alt=""
							/>
							<div className="teacher-name font-bold">{admin?.name}</div>
						</div>
						<button
							id="teacher-logout-btn"
							className="font-bold"
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				</div>
			</nav>

			<div className="menu-items py-2">
				<div className="container mx-auto">
					<ul className="flex items-start gap-x-4">
						<li>
							<NavLink className={'navlink'} to={'/dashboard/add-student'}>
								Add Student
							</NavLink>
						</li>
						<li>
							<NavLink className={'navlink'} to={'/dashboard/student-list'}>
								Student List
							</NavLink>
						</li>
						<li>
							<NavLink className={'navlink'} to={'/dashboard/student-log'}>
								Student Log
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
			<Outlet />
		</div>
	)
}

export default Dashboard
