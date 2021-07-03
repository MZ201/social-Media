import {
	ADJUST_COMMENT_REPLY,
	RESET_SYNC_COMMENT_STATE, SET_COMMENT_REPLY
} from "../constants/commentConstants"



export const addToTargetComment = (reply, id, targetUser) => {
	return {
		type: SET_COMMENT_REPLY,
		payload: {
			reply, id, targetUser
		}
	}
}
export const adjustTargetComment = (reply , id  , targetUser) => {
	return {
		type: ADJUST_COMMENT_REPLY,
		payload: {
			reply, id   , targetUser
		}
	}
}
export const removeFromTargetComment = (id) => {
	return {
		type: RESET_SYNC_COMMENT_STATE,
		payload: id
	}
}