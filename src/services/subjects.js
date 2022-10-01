import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}subjects/`

export const getAllSubjects = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const addSubject = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}