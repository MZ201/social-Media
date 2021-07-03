import axios from "axios"
import { CREATE_REACTION_REQUEST, CREATE_REACTION_FAIL, CREATE_REACTION_SUCCESS, GET_REACTION_FAIL, GET_REACTION_SUCCESS, GET_REACTION_REQUEST, DELETE_REACTION_FAIL, DELETE_REACTION_SUCCESS, DELETE_REACTION_REQUEST, UPDATE_REACTION_REQUEST, UPDATE_REACTION_SUCCESS, UPDATE_REACTION_FAIL } from "../constants/reactionConstants"

export const createReaction = (id, reaction) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_REACTION_REQUEST,
        })

        await axios.post(`http://localhost:4000/api/reaction/?post=${id}`,
            { reaction }
            , { withCredentials: true })

        dispatch({
            type: CREATE_REACTION_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: CREATE_REACTION_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const getReaction = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_REACTION_REQUEST,
        })
        const { data } = await axios.get(`http://localhost:4000/api/reaction/?post=true`,
            { withCredentials: true })

        dispatch({
            type: GET_REACTION_SUCCESS,
            payload: data.reaction
        })

    } catch (error) {
        dispatch({
            type: GET_REACTION_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}

export const updateReaction = (id, reaction) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_REACTION_REQUEST,
        })

        await axios.put(`http://localhost:4000/api/reaction/?post=${id}`,
            { reaction }
            , { withCredentials: true })

        dispatch({
            type: UPDATE_REACTION_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: UPDATE_REACTION_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}


export const deleteReaction = (id) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_REACTION_REQUEST,
        })

        await axios.delete(`http://localhost:4000/api/reaction/?post=${id}`
            , { withCredentials: true })

        dispatch({
            type: DELETE_REACTION_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: DELETE_REACTION_FAIL,
            payload:
                error.response && error.response.data.errors
                    ? error.response.data.errors
                    : error.message,
        })
    }
}