import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { RESET_SYNC_COMMENT_STATE, SET_COMMENT_REPLY,ADJUST_COMMENT_REPLY} from "../constants/commentConstants";
import { User } from "./userReducers";


export interface CommentSyncState {
	target: {
		targetUser?: User
		id?: number;
		reply?: boolean;
	}[];
}
// Target : list of comment that i wanna give a comment about them . 

export const commentSyncReducer = (state: CommentSyncState = { target: [] },
	action: AnyAction) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload.commentSync };
		case SET_COMMENT_REPLY:
			return {
				...state, target: [...state.target, action.payload]
			}
		//	case SET_COMMENT_TARGET_PERSON:
		// return { ...state, target: action.payload }

		case ADJUST_COMMENT_REPLY :
			return {...state, target : state.target.map(elm => {
				if(elm.id === action.payload.id){
					elm = action.paylod
				}
				return elm
			})}

		case RESET_SYNC_COMMENT_STATE:
			/// 
			return {...state , target : state.target.filter(elm => elm.id !== action.payload)}
		default:
			return state

	}

}
