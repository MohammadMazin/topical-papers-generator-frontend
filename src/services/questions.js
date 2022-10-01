import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}questions/`

export const searchQuestions = async(data) => {
    const response = await axios.post(`${baseUrl}search`, data)
    return response.data
}

export const addQuestion = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}