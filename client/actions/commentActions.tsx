import axios from "axios"
import {
    AUGMENTE_SKIP_GET_COMMENT, COMMENT_STATISTIC_FAIL
    , COMMENT_STATISTIC_REQUEST, COMMENT_STATISTIC_SUCCESS,
    COUNT_COMMENT_OF_POST_FAIL, COUNT_COMMENT_OF_POST_REQUEST,
    COUNT_COMMENT_OF_POST_SUCCESS,
    CREATE_COMMENT_FAIL, CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS, GET_COMMENT_FAIL, GET_COMMENT_REQUEST, GET_COMMENT_SUCCESS,
    GET_REPLY_COMMENT_FAIL, GET_REPLY_COMMENT_REQUEST, GET_REPLY_COMMENT_SUCCESS
} from "../constants/commentConstants"
import { State } from "../store"




export const getComment = (id) => async (dispatch, getState) => {

    const skip = getState().getComment.skip


    try {
        dispatch({
            type: GET_COMMENT_REQUEST,
        })
        const { data } = await axios.get(`http://localhost:4000/api/comment/post/${id}?skip=${skip}`

            , { withCredentials: true })

        dispatch({
            type: GET_COMMENT_SUCCESS,
            payload: data.comments
        })


    } catch (error) {
        dispatch({
            type: GET_COMMENT_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const getCommentOfComment = (id) => async (dispatch) => {
    try {
        dispatch({
            type: GET_REPLY_COMMENT_REQUEST,
        })
        const { data } = await axios.get(`http://localhost:4000/api/comment/${id}?skip=0`

            , { withCredentials: true })

        dispatch({
            type: GET_REPLY_COMMENT_SUCCESS,
            payload: data.comments
        })

    } catch (error) {
        dispatch({
            type: GET_REPLY_COMMENT_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}



export const createCommentAction = (id, body, ref) => async (dispatch) => {
    console.log(id)
    try {
        dispatch({
            type: CREATE_COMMENT_REQUEST,
        })

        await axios.post(`http://localhost:4000/api/comment/${id}`, { body, ref }
            , { withCredentials: true })

        const { data } = await axios.get(`http://localhost:4000/api/comment/${id}/count`
            , { withCredentials: true })

        

        dispatch({
            type: CREATE_COMMENT_SUCCESS,
        })

        dispatch({
            type : COUNT_COMMENT_OF_POST_SUCCESS , 
            payload : data
        })

        dispatch(getComment(id))
    } catch (error) {
        dispatch({
            type: CREATE_COMMENT_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}


export const commentStatistic = (id) => async (dispatch) => {
    try {
        await dispatch({
            type: COMMENT_STATISTIC_REQUEST,
        })
        // get all reply of a certain comment mean all comment that under that comment

        const { data } = await axios.get(`http://localhost:4000/api/comment/statistic/${id}`
            , { withCredentials: true })

        dispatch({
            type: COMMENT_STATISTIC_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: COMMENT_STATISTIC_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const countCommentOfPost = (id) => async (dispatch) => {
    try {
        await dispatch({
            type: COUNT_COMMENT_OF_POST_REQUEST,
        })

        const { data } = await axios.get(`http://localhost:4000/api/comment/${id}/count`
            , { withCredentials: true })

        dispatch({
            type: COUNT_COMMENT_OF_POST_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: COUNT_COMMENT_OF_POST_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

