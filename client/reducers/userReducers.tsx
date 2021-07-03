import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import {
    USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL,
    USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_FAIL, USER_REGISTER_SUCCESS, GET_CLIENT, GET_CLIENT_FAIL
} from "../constants/userConstants";
import { _Error } from "./commentReducer";

export interface userLoginState {
    userInfo?: User;
    loading?: boolean;
    error?: [{ message: '', field?: string }]
}
export interface generaleState {
    success?: boolean;
    loading?: boolean;
    error?: [{ message: '', field?: string }]
}

export type User = {
    id?: number, 
    name?: string , 
    email?: string; 
    image?: string; 
    friends?: {id : number , name : string ,image: string }[]
};

export type getClientState = {
    client?:User , 
    error?: _Error,
}

export const userLoginReducer = (state: userLoginState = { userInfo: {} }, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.userLogin };
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userRegisterReducer = (state: generaleState = {
    success: false,
    loading: false, error: null
}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.userRegister };
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, success: true }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}




export const userLogoutReducer = (state: generaleState = {
    success: false,
    loading: false, error: null
}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.userLogout };
        case USER_LOGOUT_REQUEST:
            return { loading: true }
        case USER_LOGOUT_SUCCESS:
            return { loading: false, success: true }
        case USER_LOGOUT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}


export const getClientReducer = (state: getClientState = {error : null }  ,  action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getClient};
        case GET_CLIENT:
            return  {
                ...state , client:action.payload
            }
        case GET_CLIENT_FAIL:
            return {...state , error: action.payload }
        
        default:
            return state
        }
}