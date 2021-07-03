import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { CHOOSE_STATUS_TYPE, SET_CHOOSE_STORY, SET_SAME_STORY_INDEX, SET_SAME_STORY_WIDTH, SET_STATUS_AUDIO, SET_STATUS_CONTENT, SET_STATUS_IMAGE } from "../constants/statusConstants";
import { getStatusType } from "./statusAsyncReducers";

export interface StatusState {
    choose?: string;
    img?: string;
    content?: string;
    storyIndex?: number;
    sameStoryIndex?: number;
    width?: number;
    audio?: string; 
}


export const statusTypeReducers = (state: StatusState = {},
    action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            return { ...state, ...action.payload.statusType };

        case CHOOSE_STATUS_TYPE:
            return { ...state, choose: action.payload }

        case SET_STATUS_IMAGE:
            return { ...state, img: action.payload }

        case SET_STATUS_CONTENT:
            return { ...state, content: action.payload }
        case SET_STATUS_AUDIO:
            return { ...state, audio: action.payload }


        case SET_CHOOSE_STORY:
            return { ...state, storyIndex: action.payload }

        case SET_SAME_STORY_INDEX:
            return { ...state, sameStoryIndex: action.payload }

        case SET_SAME_STORY_WIDTH:
            return { ...state, width: action.payload }

        default:
            return state
    }
}

