import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}topics/`

export const getAllTopics = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const addTopic = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const getTopicsOfSubject = async(data) => {
    const response = await axios.post(`${baseUrl}ofSubject`, data)
    return response.data
}