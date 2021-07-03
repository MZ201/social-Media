import { useDispatch } from "react-redux"
import {
    CHOOSE_STATUS_TYPE, SET_CHOOSE_STORY, SET_STATUS_CONTENT,
    SET_STATUS_IMAGE, SET_SAME_STORY_INDEX, SET_SAME_STORY_WIDTH , SET_STATUS_AUDIO
} from "../constants/statusConstants"



export const chooseStatus = (payload) => dispatch => {
    dispatch({
        type: CHOOSE_STATUS_TYPE,
        payload: payload
    })
}

export const setStatusCentent = payload => dispatch =>  {
    dispatch({
        type: SET_STATUS_CONTENT,
        payload
    })
}

export const setStatusAudio = payload => dispatch =>  {
    dispatch({
        type: SET_STATUS_AUDIO,
        payload
    })
}

export const setStatusImage = (payload) => dispatch => {
    dispatch({
        type: SET_STATUS_IMAGE,
        payload: payload
    })
}

// for change the story to another
export const setChooseStatus = (payload) => dispatch => {
    dispatch ({
        type: SET_CHOOSE_STORY,
        payload
    })
}

// same story but change status for one to the others  
export const setSameStoryIndex = (payload) => dispatch => {
    dispatch ({
        type: SET_SAME_STORY_INDEX,
        payload
    })
}

// same story but change status for one to the others  
export const setSameStoryWidth = (payload) => async dispatch => {
    dispatch({
        type: SET_SAME_STORY_WIDTH,
        payload
    })
}