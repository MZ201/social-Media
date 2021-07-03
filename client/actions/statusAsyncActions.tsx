import axios from "axios"
import {
    CREATE_STATUS_FAIL, CREATE_STATUS_REQUEST,
    CREATE_STATUS_SUCCESS, GET_MY_STATUS_REQUEST,
    GET_STATUS_FAIL, GET_STATUS_REQUEST, GET_STATUS_SUCCESS,
    GET_MY_STATUS_SUCCESS, GET_MY_STATUS_FAIL, GET_STATUS_VIEWERS_REQUEST, GET_STATUS_VIEWERS_SUCCESS, GET_STATUS_VIEWERS_FAIL, SEND_STATUS_SEEN_REQUEST, SEND_STATUS_SEEN_SUCCESS, SEND_STATUS_SEEN_FAIL
} from "../constants/statusConstants"

import socket from "../socket/socket"

export const createStatus = (body, pageRoom?: number, groupRoom?: number) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_STATUS_REQUEST,
        })

        await axios.post('http://localhost:4000/api/status',
            { body, pageRoom, groupRoom }
            , { withCredentials: true })

        dispatch({
            type: CREATE_STATUS_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: CREATE_STATUS_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}



export const getStatus = (headers) => async (dispatch) => {
    try {
        dispatch({
            type: GET_STATUS_REQUEST
        })
        let res
        if (!headers) {
            const { data } = await axios.get('http://localhost:4000/api/status',
                { withCredentials: true })

            res = data
        } else {
            const { data } = await axios.get('http://localhost:4000/api/status',
                {
                    headers,
                    withCredentials: true
                })
            res = data
        }


        dispatch({
            type: GET_STATUS_SUCCESS,
            payload: res.status
        })

    } catch (error) {
        dispatch({
            type: GET_STATUS_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}


export const getMyStatus = (headers) => async (dispatch) => {
    try {
        dispatch({
            type: GET_MY_STATUS_REQUEST
        })

        let res
        if (!headers) {
            const { data } = await axios.get('http://localhost:4000/api/status/user',
                { withCredentials: true })

            res = data
        } else {
            const { data } = await axios.get('http://localhost:4000/api/status/user',
                {
                    headers,
                    withCredentials: true
                })
            res = data
        }


        dispatch({
            type: GET_MY_STATUS_SUCCESS,
            payload: res.status
        })

    } catch (error) {
        dispatch({
            type: GET_MY_STATUS_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}


export const getStatusViewers = (id) => async (dispatch) => {
    try {
        dispatch({
            type: GET_STATUS_VIEWERS_REQUEST
        })

        const { data } = await axios.get(`http://localhost:4000/api/status/${id}`,
            { withCredentials: true })

        dispatch({
            type: GET_STATUS_VIEWERS_SUCCESS,
            payload: data.visitor
        })

    } catch (error) {
        dispatch({
            type: GET_STATUS_VIEWERS_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}


export const addStatusSeen = (id) => async (dispatch) => {
    try {
        dispatch({
            type: SEND_STATUS_SEEN_REQUEST
        })

        await axios.post(`http://localhost:4000/api/status/${id}`, {},
            { withCredentials: true })

        dispatch({
            type: SEND_STATUS_SEEN_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: SEND_STATUS_SEEN_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}