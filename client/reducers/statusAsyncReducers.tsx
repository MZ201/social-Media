import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import {
    ADJUST_STATUS_BY_SOCKET,
    CREATE_STATUS_FAIL, CREATE_STATUS_REQUEST, CREATE_STATUS_SUCCESS,
    GET_MY_STATUS_FAIL, GET_MY_STATUS_REQUEST, GET_MY_STATUS_SUCCESS, GET_STATUS_FAIL,
    GET_STATUS_REQUEST, GET_STATUS_SUCCESS, GET_STATUS_VIEWERS_FAIL, GET_STATUS_VIEWERS_REQUEST, GET_STATUS_VIEWERS_SUCCESS, SEND_STATUS_SEEN_FAIL, SEND_STATUS_SEEN_REQUEST, SEND_STATUS_SEEN_SUCCESS
} from "../constants/statusConstants";
import { _Error } from "./commentReducer";
import { generaleState, User } from "./userReducers";


export type Status =
    {
        id: number;
        name: string;
        image: string;
        email: string;
        statusCreator: {
            id?: number ; 
            body: {
                audio?: string;
                img?: string;
                video?: string;
                content?: string;
                _seen?: number | null;
            },
            visitor : boolean ; 
            createdAt?: string;
        }[]
        pageRoom?: {
            name: string;
            image: string
        },
        groupRoom: {
            name: string;
            image: string

        }
    }



export interface getStatusType {
    status?: Status[];
    loading?: boolean;
    error?: boolean
}

export interface getMyStatus {
    myStatus?: Status;
    loading?: boolean;
    error?: _Error
}

export interface getStatusViewers {
    loading?: boolean;
    error?: _Error;
    viewers?: User[]
}


export const createStatusReducer = (state: getStatusType = {
    status: [],
    loading: false, error: null
}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.createStatus };
        case CREATE_STATUS_REQUEST:
            return { loading: true }
        case CREATE_STATUS_SUCCESS:
            return { loading: false, success: true }

        case CREATE_STATUS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}


export const getStatusReducer = (state: getStatusType = {}, action: any) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getStatus};
        case GET_STATUS_REQUEST:
            return { loading: true }
        case GET_STATUS_SUCCESS:
            return { ...state , loading: false, status: action.payload }
        case GET_STATUS_FAIL:
            return { ...state , loading: false, error: action.payload }

        case ADJUST_STATUS_BY_SOCKET:
            return {...state , 
                status : state.status.map( story => {
                    if(story.id === action.payload.creator.id){
                        story.statusCreator.push(action.payload)
                    }
                    return story
                })
            }
        default:
            return state
    }
}

export const getMyStatusReducer = (state: getMyStatus = {}, action: any) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.myStatus };
        case GET_MY_STATUS_REQUEST:
            return { loading: true }
        case GET_MY_STATUS_SUCCESS:
            return { loading: false, myStatus: action.payload }
        case GET_MY_STATUS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}



export const getStatusViewers = (state: getStatusViewers = {}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getViewers };
        case GET_STATUS_VIEWERS_REQUEST:
            return { ...state , loading: true }
        case GET_STATUS_VIEWERS_SUCCESS:
            return { ...state , loading: false, viewers: action.payload }
        case GET_STATUS_VIEWERS_FAIL:
            return { ...state , loading: false, error: action.payload }
        default:
            return state
    }
}

export const sendStatusSeenReducers = (state: generaleState = {}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.statusSeen };
        case SEND_STATUS_SEEN_REQUEST:
            return { loading: true }
        case SEND_STATUS_SEEN_SUCCESS:
            return { loading: false, success: true }
        case SEND_STATUS_SEEN_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}