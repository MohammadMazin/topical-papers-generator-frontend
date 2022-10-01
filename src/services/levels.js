import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}levels/`

export const getAllLevels = async() => {
    const response = await axios.get(baseUrl)
    return response.data
}

export const addLevel = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const getAllLevelsOfBoard = async(data) => {
    const response = await axios.post(`${baseUrl}ofBoard`, data)
    return response.data
}