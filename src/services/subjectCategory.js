import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}subjectCategorys/`

export const getAllSubjectCategorys = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const addSubjectCategory = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const deleteSubjectCategory = async(data) => {
    const response = await axios.post(`${baseUrl}delete`, data)
    return response.data
}

export const editSubjectCategory = async(data) => {
    const response = await axios.post(`${baseUrl}edit`, data)
    return response.data
}