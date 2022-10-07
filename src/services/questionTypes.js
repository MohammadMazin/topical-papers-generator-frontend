import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}questionTypes/`

export const getQuestionTypes = async() => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

export const addQuestionType = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}
export const editQuestionType = async(data) => {
    const response = await axios.post(`${baseUrl}edit`, data)
    return response.data
}
export const deleteQuestionType = async(data) => {
    const response = await axios.post(`${baseUrl}delete`, data)
    return response.data
}