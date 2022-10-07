import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}boards/`

export const getAllBoards = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const addBoard = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const deleteBoard = async(data) => {
    const response = await axios.post(`${baseUrl}delete`, data)
    return response.data
}

export const editBoard = async(data) => {
    const response = await axios.post(`${baseUrl}edit`, data)
    return response.data
}