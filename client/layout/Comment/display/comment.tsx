import { faArrowRight, faEllipsisH, faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Image } from 'react-bootstrap'
import classes from './comment.module.css'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToTargetComment, adjustTargetComment, removeFromTargetComment } from '../../../actions/commentSyncAction'
import { State } from '../../../store'
import { commentStatistic, getCommentOfComment } from '../../../actions/commentActions'
import { GET_REPLY_COMMENT_RESET } from '../../../constants/commentConstants'

const Comment = ({ id, body, creator, width }) => {

    const { comments } = useSelector((state: State) => state.getComment)
    const { commentsStatistic } = useSelector((state: State) => state.commentStatistic)
    const { comments: replyComment } = useSelector((state: State) => state.getCommentOfComment)
    const { target: targetComment } = useSelector((state: State) => state.commentSync)

    const thisCommentReply = replyComment?.filter(comment => comment.ref.id === id)

    const dispatch = useDispatch()

    const thisComment = commentsStatistic?.find(cmt => cmt.comments?.ref_id === id)

    const replyCommentCount = thisComment?.comments?.count

    const replyCount = thisComment?.reactions.reduce((acc, cur) => acc + Number(cur.count), 0)

    const reactImages = thisComment?.reactions.map((react, index) => (
        <Image src={`/emogy/${react.reaction}.png`} width='18px' height='18px'
            roundedCircle fluid key={index}
        />
    ))



    const replyHandler = () => {
        // dispatch action for reset or add something to the target comment . 
        // mean the comment that I wann a give a comment about them.
        const ref = replyComment?.find(elm => elm.id === id)

        const refComment = ref ? ref.ref.id : id

        const index = targetComment?.findIndex(elm => elm.id === refComment)

        if (index === -1) {
            dispatch(addToTargetComment(true, refComment, creator))
            dispatch(getCommentOfComment(id))
            return
        }
        if (refComment !== id) {
            dispatch(adjustTargetComment(true, refComment, creator))
            return
        }
        dispatch(removeFromTargetComment(refComment))
        // WRONG SHOULD BE USE A METHODE TO SUPPREME ONLY FOR THIS REF COMMENT
        dispatch({
            type: GET_REPLY_COMMENT_RESET,
            payload: refComment
        })
    }

    const replyCommentHandler = () => {
        dispatch(getCommentOfComment(id))

        dispatch(addToTargetComment(true, id, creator))
    }

    useEffect(() => {
        dispatch(commentStatistic(id))
    }, [])

    return (
        <>
            <div className={`row mt-2 p-0  ${classes.show}`}
                style={{
                    width: `${width}%`,
                    margin: '0',
                    marginLeft: width === 100 ? '0' : '2.3rem'
                }}
            >
                <div className={`column col-2 d-flex aling-item-start justify-content-center ${classes.img}`}>
                    <Image src='upload/logo.jpg' width={32} height={32} roundedCircle />
                </div>
                <div className={`column col-8 ${classes.body}`}>
                    <span className='pl-2'>{creator.name}</span>
                    <p className={`${classes.msg} pl-2`}>
                        {body.content}
                    </p>
                    {replyCount > 0 &&
                        (
                            <div className={`row ${classes.emogyStatistic}`}>
                                <div className="column ml-1">
                                    {reactImages}
                                </div>
                                <span style={{
                                    margin: '0 5px 0 5px'
                                }}>
                                    {replyCount}
                                </span>

                            </div>
                        )
                    }

                </div>
                <div className={`column col-1 m-0 p-0 ml-4 ${classes.option}`}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </div>
            </div>
            {body.img && <div className='row'
                style={{
                    maxWidth: "80%"
                }}
            >
                <div className='column offset-3 h-100'>
                    <Image src={body.img} fluid
                    />
                </div>
            </div>
            }

            <div className='row'>
                <div className='column col-2'></div>
                <div className='column col-9'>
                    <div className='row'
                        style={{
                            marginLeft: width === 100 ? '0' : '2.3rem',
                        }}
                    >
                        <div className='column  text-info ml-2'>
                            <span className={`${classes.msg}`}>Like</span>
                        </div>
                        <div className='column  text-info ml-2'>
                            <span className={`${classes.msg}`}
                                onClick={replyHandler}
                            >
                                Reply
                            </span>
                        </div>
                        <div className='column  text-info ml-2'>
                            <span className={`${classes.msg}`}>12h</span>
                        </div>
                    </div>
                </div>
            </div>


            {replyCommentCount > 0 && thisCommentReply.length === 0 &&
                (
                    <div className='row'
                    >
                        <div className='column offset-3'
                            style={{
                                cursor: "pointer"
                            }}
                            onClick={replyCommentHandler}
                        >
                            <FontAwesomeIcon icon={faReply} style={{
                                fontSize: "14px",
                                transform: 'rotate(167deg)',
                                display: 'inline-block',
                                marginRight: '1rem'
                            }} />
                            {replyCommentCount} Reply...
                        </div>
                    </div>)
            }
        </>
    )
}

export default Comment
