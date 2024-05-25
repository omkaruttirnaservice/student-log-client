import React, { useContext, useEffect, useState } from 'react'
import './student-log.css'
// import { _students } from '../../dummyData'
import { AuthContext } from '../../context/AuthContext'
import _axios from '../../axiosInterceptor/_axios'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import { date, number, object, string } from 'yup'
import { StudentsContext } from '../../context/studentsContext'

const StudentLog = () => {
	const { admin } = useContext(AuthContext)
	const { students, handleFetchStudents } = useContext(StudentsContext)

	const initialSessionState = {
		time_start: '',
		time_end: '',
		topic_discussed: '',
		home_work: '',
		student_id: 0,
		session_date: '',
		video_url: '',
	}

	const [showStudentForm, setShowStudentForm] = useState(null)
	const [student, setStudent] = useState({})

	const [sessions, setSessions] = useState([])

	const [studentSession, setStudentSession] = useState(initialSessionState)

	useEffect(() => {
		handleFetchStudents()
	}, [])

	const sessionSchema = object({
		video_url: string()
			.url('Video URL must be a valid URL')
			.required('Video URL is required'),
		session_date: date()
			.required('Session date is required')
			.max(new Date(), 'Session date cannot be in the future'),
		home_work: string()
			.required('Homework is required')
			.min(3, 'Homework must be at least 5 characters long'),
		topic_discussed: string()
			.required('Topic discussed is required')
			.min(3, 'Topic discussed must be at least 5 characters long'),

		time_end: string().required('End time is required'),
		// .matches(
		// 	/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
		// 	'End time must be in HH:MM format'
		// )
		// .test(
		// 	'is-after-start',
		// 	'End time must be after start time',
		// 	function (value) {
		// 		const { time_start } = this.parent
		// 		return !value || !time_start || value > time_start
		// 	}
		// )
		time_start: string().required('Start time is required'),
		// .matches(
		// 	/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
		// 	'Start time must be in HH:MM format'
		// )
		student_id: number()
			.required('Student ID is required')
			.positive('Student ID must be a positive number')
			.integer('Student ID must be an integer'),
	})

	useEffect(() => {
		if (student.student_id !== 0) {
			setStudentSession((prevData) => ({
				...prevData,
				['student_id']: student.id,
			}))
		}
	}, [student])

	console.log(studentSession)
	// console.log(student)

	useEffect(() => {
		handleFetchStudents()
	}, [])

	const handleSubmitStudentSession = async (e) => {
		e.preventDefault()
		try {
			const _studentSession = await sessionSchema.validate(studentSession)
			const { data } = await _axios.post('/admin/add-session', studentSession)
			console.log(data)

			const { _success, _data, _message } = data

			if (_success) {
				toast.success(_message)
				setStudentSession(initialSessionState)
			}
		} catch (err) {
			console.log(err)
			let showError = err.errors?.length
				? err.errors[0]
				: err.response.data._message
			toast.error(showError)
			console.log(`Error while submitting the student session : ${err}`)
		}
	}

	const handleFetchStudentSessions = async () => {
		try {
			const { data } = await _axios.post('/admin/get-session', {
				student_id: student.id,
			})

			const { _success, _data } = data

			if (_success) {
				const { _sessions } = _data
				setSessions(_sessions)
			}
		} catch (err) {
			console.log(`Error while fetching the student sessions : ${err}`)
		}
	}

	// console.log(student)

	const handleStudentSessionChange = (e) => {
		setStudentSession((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	return (
		<div id="student-log-component">
			<div className="container">
				<div className="flex align-center gap-3 justify-center">
					<label
						htmlFor=""
						className={
							'block mb-2 text-base font-medium text-gray-900 dark:text-white'
						}
					>
						Select Student
					</label>
					<select
						className={
							'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						}
						name=""
						id=""
						value={student.id}
						onChange={(e) => {
							setShowStudentForm(null)
							setStudent(students.find((_stud) => _stud.id == e.target.value))
						}}
					>
						<option className="text-center font-bold" value="">
							-- Select Student--
						</option>
						{students.map((_student, index) => (
							<option className="py-1" value={_student.id} key={_student.id}>
								{_student.s_name} ({_student.id})
							</option>
						))}
					</select>

					{student && (
						<>
							<button
								className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-200 text-teal-800"
								onClick={() => setShowStudentForm(true)}
							>
								Add Session
							</button>
							<button
								className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600"
								onClick={() => {
									setShowStudentForm(false)
									handleFetchStudentSessions()
								}}
							>
								Show Report
							</button>
						</>
					)}
				</div>

				{showStudentForm != null && showStudentForm && (
					<div className="form-container">
						<form id="student-session-form">
							<h1 className="text-center text-2xl mb-2">Add Session</h1>
							<div className="form">
								<input
									type="text"
									name="time_start"
									placeholder="Time Start"
									value={studentSession.time_start}
									onChange={handleStudentSessionChange}
								/>
								<input
									type="text"
									name="time_end"
									placeholder="Time End"
									value={studentSession.time_end}
									onChange={handleStudentSessionChange}
								/>

								<input
									type="text"
									name="topic_discussed"
									placeholder="Topic Discussed"
									value={studentSession.topic_discussed}
									onChange={handleStudentSessionChange}
								/>
								<input
									type="text"
									name="home_work"
									placeholder="Homework"
									value={studentSession.home_work}
									onChange={handleStudentSessionChange}
								/>
								<input
									type="text"
									name="session_date"
									placeholder="Session Date"
									value={studentSession.session_date}
									onChange={(e) =>
										setStudentSession((prevData) => ({
											...prevData,
											['session_date']: e.target.value,
										}))
									}
								/>
								<input
									type="text"
									name="video_url"
									placeholder="Video URL"
									value={studentSession.video_url}
									onChange={handleStudentSessionChange}
								/>

								<input
									type="text"
									value={student.id}
									onChange={handleStudentSessionChange}
									hidden
								/>

								<button
									className={
										'text-white  bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-base px-5 py-2.5 text-center me-2 mb-2'
									}
									onClick={handleSubmitStudentSession}
								>
									Save Session
								</button>
							</div>
						</form>
					</div>
				)}
				{showStudentForm != null && !showStudentForm && (
					<>
						<div className="mt-4 w-full min-w-max table-auto text-left">
							<table
								className="mt-4 w-full min-w-max table-auto text-left"
								id="sessions-table"
							>
								<thead>
									<tr>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											Date
										</th>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											Start Time
										</th>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											End Time
										</th>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											Topic Discussed
										</th>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											Homework
										</th>
										<th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
											Video
										</th>
									</tr>
								</thead>

								<tbody>
									{sessions.map((_session, index) => (
										<tr key={_session.id}>
											<td className="p-4 border-b border-blue-gray-50">
												{new Date(_session.session_date)
													.toLocaleDateString('en-GB', {
														day: '2-digit',
														month: 'short',
														year: 'numeric',
													})
													.replace(/ /g, ' ')}
											</td>
											<td className="p-4 border-b border-blue-gray-50">
												{_session.time_start}
											</td>
											<td className="p-4 border-b border-blue-gray-50">
												{_session.time_end}
											</td>
											<td className="p-4 border-b border-blue-gray-50">
												{_session.topic_discussed}
											</td>
											<td className="p-4 border-b border-blue-gray-50">
												{_session.home_work}
											</td>
											<td className="p-4 border-b border-blue-gray-50">
												<NavLink to={_session.video_url}>Click</NavLink>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default StudentLog
