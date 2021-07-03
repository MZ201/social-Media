import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { CREATE_POST_FAIL, CREATE_POST_REQUEST, CREATE_POST_SUCCES, GET_POST_FAIL, GET_POST_REQUEST, GET_POST_SUCCES } from "../constants/postContants";
import { generaleState } from "./userReducers";



export interface Post {
    body?: string;
    path?: string;
    id?: number;
    creator? : {
        name : string
    } ; 
    createdAt : string ; 
    pageRoom? : {name : string , img : string} ; 
    groupRoom? : {name : string}
}

export interface Posts {
    posts?: Post[]
}

export const createPostReducer = (state: generaleState = {
    success: false,
    loading: false, error: null
}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.createPost };
        case CREATE_POST_REQUEST:
            return { loading: true }
        case CREATE_POST_SUCCES:
            return { loading: false, success: true }
        case CREATE_POST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}



export const getPostReducer = (state: Posts = { posts: [] }
    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getPosts };
        case GET_POST_REQUEST:
            return { loading: true }
        case GET_POST_SUCCES:
            return {
                loading: false, posts: state.posts
                    ? [...state.posts, ...action.payload] : [...action.payload]
            }
        case GET_POST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}


