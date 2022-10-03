import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}users/`

export const getAllUsers = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const getSingleUser = async(data) => {
    const response = await axios.post(`${baseUrl}user`, data)
    return response.data
}

export const getUnverifiedUsers = async() => {
    const response = await axios.get(`${baseUrl}unverified`)
    return response.data
}

export const addUser = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const createAdmin = async(data) => {
    const response = await axios.post(`${baseUrl}add/admin`, data)
    return response.data
}

export const approveUser = async(data) => {
    const response = await axios.post(`${baseUrl}approve`, data)
    return response.data
}

export const unapproveUser = async(data) => {
    const response = await axios.post(`${baseUrl}unapprove`, data)
    return response.data
}

export const login = async(data) => {
    const response = await axios.post(`${baseUrl}login`, data)
    return response.data
}

export const loginAdmin = async(data) => {
    const response = await axios.post(`${baseUrl}login/admin`, data)
    return response.data
}