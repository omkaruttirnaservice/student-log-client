import React, { useContext, useEffect, useState } from 'react'
import './student-list.css'
// import { _students } from '../../dummyData'
import axios from 'axios'
import _axios from '../../axiosInterceptor/_axios'
import { AuthContext } from '../../context/AuthContext'
import { StudentsContext } from '../../context/studentsContext'

const StudentList = () => {
	const { admin } = useContext(AuthContext)

	const { students, handleFetchStudents } = useContext(StudentsContext)

	useEffect(() => {
		handleFetchStudents()
	}, [])

	return (
		<div>
			<div className="container">
				<h1 className="text-center mt-2 mb-3 font-bold">Student List</h1>

				{students && students.length > 0 ? (
					<table className=" divide-y divide-gray-200 w-[80%] mx-auto mb-3">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
								>
									Mobile
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
								>
									Email
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200 text-sm fw-medium">
							{students.map((student, index) => (
								<tr
									key={student.id}
									className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										{student.s_name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{student.s_mob}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{student.s_email}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<h2>Students not found</h2>
				)}
			</div>
		</div>
	)
}

export default StudentList
