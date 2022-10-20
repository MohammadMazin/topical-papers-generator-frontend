import axios from "axios";
import { dbUrl } from "../globals/dbUrl";

const baseUrl = `${dbUrl}savedPapers/`

export const getSavedPaperOfUser = async(data) => {
    const response = await axios.post(`${baseUrl}user`, data)
    return response.data
}

export const addSavedPaper = async(data) => {
    const response = await axios.post(`${baseUrl}add`, data)
    return response.data
}

export const deleteSavedPaper = async(data) => {
    const response = await axios.post(`${baseUrl}delete`, data)
    return response.data
}