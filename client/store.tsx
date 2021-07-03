import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'


import {
  generaleState, userLoginReducer, userLoginState, userLogoutReducer,
  userRegisterReducer, getClientState, getClientReducer
} from './reducers/userReducers'
import { createPostReducer, getPostReducer, Posts } from './reducers/postReducer'
import { commentStatisticReducer, countComment, countCommentOfPost, createCommentReducer, getComment, getCommentOfCommentReducer, getCommentReducer, groupCommentStatistic } from './reducers/commentReducer';
import { createReactionReducer, getReactionReducer, getReactionState, updateReactionReducer } from './reducers/reactionReducer';
import { statusTypeReducers } from './reducers/statusSyncReducers';
import { StatusState } from './reducers/statusSyncReducers'
import { createStatusReducer, getMyStatus, getMyStatusReducer, getStatusReducer, getStatusType, getStatusViewers, sendStatusSeenReducers } from './reducers/statusAsyncReducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper } from 'next-redux-wrapper';
import { commentSyncReducer, CommentSyncState } from './reducers/commentSyncReducers';

export interface State {
  userLogin?: userLoginState;
  userRegister?: generaleState;
  getClient?: getClientState;
  createPost?: generaleState;
  getPosts?: Posts;
  getComment?: getComment;
  createComment?: generaleState;
  commentSync?: CommentSyncState;
  getReaction?: getReactionState;
  createReaction?: generaleState;
  updateReaction?: generaleState;
  statusType?: StatusState;
  createStatus?: generaleState;
  getStatus?: getStatusType;
  myStatus?: getMyStatus;
  getViewers?: getStatusViewers;
  statusSeen?: generaleState;
  commentStatistic?: groupCommentStatistic;
  getCommentOfComment?: getComment;
  countComment?: countComment
}


const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userLogout: userLogoutReducer,
  getClient: getClientReducer,
  createPost: createPostReducer,
  getPosts: getPostReducer,
  getComment: getCommentReducer,
  createComment: createCommentReducer,
  getReaction: getReactionReducer,
  createReaction: createReactionReducer,
  updateReaction: updateReactionReducer,
  statusType: statusTypeReducers,
  createStatus: createStatusReducer,
  getStatus: getStatusReducer,
  myStatus: getMyStatusReducer,
  getViewers: getStatusViewers,
  statusSeen: sendStatusSeenReducers,
  commentSync: commentSyncReducer,
  commentStatistic: commentStatisticReducer,
  getCommentOfComment: getCommentOfCommentReducer,
  countComment: countCommentOfPost
})

const middleware = [thunk]



// create a makeStore function

const initialState: State = null



const initStore = () => {
  return createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))
}

export const wrapper = createWrapper(initStore)


