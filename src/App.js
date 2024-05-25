import './main.css'
import './App.css'

import Login from './pages/login/Login'
import Register from './pages/register/Register'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import AddStudentForm from './components/addStudent/AddStudentForm'
import StudentLog from './components/studentLog/StudentLog'
import StudentList from './components/studentList/StudentList'
import Cookies from 'js-cookie'

function App() {
	const useAuth = () => {
		const token = Cookies.get('token')
		return !!token
	}

	const ProtectedRoute = () => {
		const isAuth = useAuth()

		return isAuth ? <Outlet /> : <Navigate to="/" />
	}

	return (
		<>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<ProtectedRoute />}>
					<Route path="" element={<Dashboard />}>
						<Route path="add-student" element={<AddStudentForm />} />
						<Route path="student-list" element={<StudentList />} />
						<Route path="student-log" element={<StudentLog />} />
					</Route>
				</Route>
			</Routes>
		</>
	)
}

export default App
