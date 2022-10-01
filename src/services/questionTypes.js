import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}questionTypes/`

export const getQuestionTypes = async() => {
    const response = await axios.get(`${baseUrl}`)
    return response.data
}

// TODO: add question types page in frontend
export const addQuestionType = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}