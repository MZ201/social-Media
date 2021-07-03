import axios from "axios"
import {
    CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCES,
    GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCES
} from "../constants/postContants"

export const createPost = (body, pageRoom?: number, groupRoom?: number) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_POST_REQUEST,
        })

        await axios.post('http://localhost:4000/api/post',
            { body, pageRoom, groupRoom }
            , { withCredentials: true })

        dispatch({
            type: CREATE_POST_SUCCES,
        })

        dispatch(getPosts())
    } catch (error) {
        dispatch({
            type: CREATE_POST_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const getPosts = () => async (dispatch) => {
    const skip = 0
    try {
        dispatch({
            type: GET_POST_REQUEST,
        })

        const { data } = await axios.get(`http://localhost:4000/api/post/?skip=${skip}`,
            { withCredentials: true })

        dispatch({
            type: GET_POST_SUCCES,
            payload: data.posts
        })

    } catch (error) {
        dispatch({
            type: GET_POST_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

