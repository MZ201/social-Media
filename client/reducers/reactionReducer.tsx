import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { CREATE_REACTION_FAIL, CREATE_REACTION_REQUEST, CREATE_REACTION_SUCCESS, GET_REACTION_FAIL, GET_REACTION_REQUEST, GET_REACTION_SUCCESS } from "../constants/reactionConstants";
import { generaleState } from "./userReducers";


export interface getReactionState {
    reaction?:[{post  : {id : number} ; reaction : string}];
    loading?: boolean;
    error?: [{ message: '', field?: string }];
}


export const createReactionReducer = (state: generaleState = {}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload };
        case CREATE_REACTION_REQUEST:
            return { loading: true }
        case CREATE_REACTION_SUCCESS:
            return { loading: false, success: true }
        case CREATE_REACTION_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const getReactionReducer = (state: getReactionState = {}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload };
        case GET_REACTION_REQUEST:
            return { loading: true }
        case GET_REACTION_SUCCESS:
            return {
                loading: false, reaction: action.payload
            }

        case GET_REACTION_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}


export const updateReactionReducer = (state: generaleState = {}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload };
        case CREATE_REACTION_REQUEST:
            return { loading: true }
        case CREATE_REACTION_SUCCESS:
            return { loading: false, success: true }
        case CREATE_REACTION_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}