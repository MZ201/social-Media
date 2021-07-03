import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import {
    AUGMENTE_SKIP_GET_COMMENT, COMMENT_STATISTIC_FAIL, COMMENT_STATISTIC_REQUEST,

    COMMENT_STATISTIC_SUCCESS, COUNT_COMMENT_OF_POST_FAIL, COUNT_COMMENT_OF_POST_REQUEST,
    COUNT_COMMENT_OF_POST_SUCCESS,
    CREATE_COMMENT_FAIL, CREATE_COMMENT_REQUEST,
    CREATE_COMMENT_SUCCESS, GET_COMMENT_FAIL, GET_COMMENT_REQUEST, GET_COMMENT_RESET,
    GET_COMMENT_SUCCESS, GET_REPLY_COMMENT_FAIL, GET_REPLY_COMMENT_REQUEST,
    GET_REPLY_COMMENT_RESET, GET_REPLY_COMMENT_SUCCESS
} from "../constants/commentConstants";
import { generaleState } from "./userReducers";

export interface getComment {
    loading?: boolean;
    comments?: {
        id?: number,
        body?: "{ content: string }"
        , post?: { id: number },
        pageRoom?: { name: string, image: string },
        creator?: { name: string, id: number }
        ref?: { id: number }
    }[];
    error?: _Error;
    skip?: number;
}


export interface groupCommentStatistic {
    loading?: boolean;
    error?: _Error;

    commentsStatistic?: {
        comments: { ref_id: number, count: number },
        reactions: { reaction: string, count: number }[]
    }[]
    ;

}

export interface countComment {
    loading?: boolean;
    error?: _Error;
    Count?: Map<number, number>;
}


export type _Error = [{ message: '', field?: string }]

export const getCommentReducer = (state: getComment = { comments: [], skip: 0 }
    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getComment };
        case GET_COMMENT_REQUEST:
            return { ...state, loading: true }
        case GET_COMMENT_SUCCESS:
            return {
                ...state, loading: false, comments: [...state.comments, ...action.payload]
            }
        case GET_COMMENT_FAIL:
            return { ...state, loading: false, error: action.payload }

        case GET_COMMENT_RESET:
            return {
                ...state, comments: state.comments.filter(comment =>
                    comment.post.id !== action.postID),
                skip: 0
            }

        case AUGMENTE_SKIP_GET_COMMENT:
            return { ...state, skip: action.payload === -1 ? 0: state.skip + 1}
        default:
            return state
    }
}


export const getCommentOfCommentReducer = (state: getComment = { comments: [] }
    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.getCommentOfComment };
        case GET_REPLY_COMMENT_REQUEST:
            return { ...state, loading: true }
        case GET_REPLY_COMMENT_SUCCESS:
            return {
                loading: false, comments: [...state.comments, ...action.payload]
            }
        case GET_REPLY_COMMENT_FAIL:
            return { loading: false, error: action.payload }

        case GET_REPLY_COMMENT_RESET:
            return { ...state, comments: state.comments.filter(elm => elm.ref.id !== action.payload) }

        default:
            return state
    }
}

export const createCommentReducer = (state: generaleState = {}
    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.createComment };
        case CREATE_COMMENT_REQUEST:
            return { loading: true }
        case CREATE_COMMENT_SUCCESS:
            return { loading: false, success: true }
        case CREATE_COMMENT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}



export const commentStatisticReducer = (state: groupCommentStatistic = { commentsStatistic: [] }
    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.commentStatistic };
        case COMMENT_STATISTIC_REQUEST:
            return {
                ...state, loading: true
            }
        case COMMENT_STATISTIC_SUCCESS:
            return {
                loading: false, commentsStatistic: [...state.commentsStatistic
                    , action.payload]
            }
        case COMMENT_STATISTIC_FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}


export const countCommentOfPost = (state: countComment = {}

    , action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return {
                ...state, ...action.payload.countComment , Count :new Map()
            };
        case COUNT_COMMENT_OF_POST_REQUEST:
            return {
                ...state, loading: true
            }
        case COUNT_COMMENT_OF_POST_SUCCESS:
            return {
                ...state, loading: false,
                Count: state.Count.set(action.payload.postID, action.payload.count)
            }
        case COUNT_COMMENT_OF_POST_FAIL:
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}


