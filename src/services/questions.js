import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}questions/`

export const getAllQuestions = async() => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

export const searchQuestions = async(data) => {
    const response = await axios.post(`${baseUrl}search`, data)
    return response.data
}

export const addQuestion = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const editQuestion = async(data) => {
    const response = await axios.post(`${baseUrl}edit`, data)
    return response.data
}

export const deleteQuestion = async(data) => {
    const response = await axios.post(`${baseUrl}delete`, data)
    return response.data
}