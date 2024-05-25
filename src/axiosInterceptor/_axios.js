import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const _axios = axios.create({
	baseURL: process.env.REACT_APP_API_BASEURL, // Replace with your API base URL
})

_axios.interceptors.request.use(
	(config) => {
		const token = Cookies.get('token')

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default _axios
