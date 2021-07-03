import axios from "axios"
import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT_FAIL, USER_LOGOUT_SUCCESS, USER_LOGOUT_REQUEST, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, GET_CLIENT, GET_CLIENT_FAIL } from "../constants/userConstants"


export const userLogin = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        })

        const { data } = await axios.post('http://localhost:4000/api/user/login', { email, password }
            , { withCredentials: true })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const userLogout = () => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGOUT_REQUEST,
        })

        const { data } = await axios.post('http://localhost:4000/api/user/logout', {}
            , { withCredentials: true })
        dispatch({
            type: USER_LOGOUT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_LOGOUT_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const userRegister = (name, email, password, phoneNumber) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST,
        })

        const { data } = await axios.post('http://localhost:4000/api/user/register', { name, email, password, phoneNumber }
            , { withCredentials: true })
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const getClient = (headers) => async (dispatch) => {
    try {
       

        const { data } = await axios.get('http://localhost:4000/api/user/',
             { withCredentials: true , headers })
        dispatch({
            type: GET_CLIENT,
            payload: data.user
        })
       
    } catch (error) {
        dispatch({
            type: GET_CLIENT_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

