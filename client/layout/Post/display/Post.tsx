import { faCaretRight, faEllipsisH, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Image } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { commentStatistic, countCommentOfPost, getComment } from "../../../actions/commentActions"
import Comment from "../../Comment/display/comment"
import CreateComment from "../../Comment/create/createComment"

import LinkDropdown from "../../../component/LinkDropdown"
import UserInteract from "../../../component/userInteract"
import { AUGMENTE_SKIP_GET_COMMENT, GET_COMMENT_RESET } from "../../../constants/commentConstants"
import { State } from "../../../store"
import classes from "./Post.module.css"




const Post = ({ creator, date, body, id, group }) => {
    const [show, setShow] = useState(false)


    const commentContainer = React.useRef<HTMLDivElement | null>(null)

    const dispatch = useDispatch()

    const { Count: CommentCount } = useSelector((state: State) => state.countComment)
    const { success: createCommentSuccess } = useSelector((state: State) => state.createComment)
    const { comments } = useSelector((state: State) => state.getComment)
    const { comments: replyComment } = useSelector((state: State) => state.getCommentOfComment)

    const { target: targetComment } = useSelector((state: State) => state.commentSync)

    // const postID = comments && comments.length > 0 ? : null 

    let Comments = []

    const commentOfThisPost = comments?.filter(comment => comment.post.id === id)

    Comments = useMemo(() => commentOfThisPost?.map((cmt, index) => {
        const body = JSON.parse(cmt.body)

        // get reply Comment

        const thisCommentReply = replyComment?.filter(comment => comment.ref.id === cmt.id)

        const commentOfThisComment = thisCommentReply?.map(comment =>
            <Comment key={index} id={comment.id}
                body={JSON.parse(comment.body)} creator={comment.creator}
                width={90}
            />
        )

        // both of them 

        const target = targetComment?.find(target => target.id === cmt.id)


        return (
            <>
                <Comment key={index} id={cmt.id} body={body} creator={cmt.creator}
                    width={100}
                />

                {commentOfThisComment}

                {
                    target?.id === cmt.id
                    &&
                    <CreateComment postID={id} refComment={cmt.id}
                        InitialValue={target?.targetUser?.name} replyComment={true}
                    />
                }


            </>
        )
    }), [comments, replyComment, targetComment])

    useEffect(() => {
    }, [createCommentSuccess, targetComment?.length, comments?.length, CommentCount.get(id)])

    const commentHandler = () => {
        setShow(!show)
        if (show) {
            dispatch({
                type: GET_COMMENT_RESET,
                postID: id
            })
        } else {
            dispatch(getComment(id))
            dispatch(countCommentOfPost(id))
            dispatch({
                type: AUGMENTE_SKIP_GET_COMMENT
            })

        }

    }

    const moreCommentHandler = () => {
        dispatch(getComment(id))
        dispatch({
            type: AUGMENTE_SKIP_GET_COMMENT
        })
    }

    return (
        <>
            <div
                className={`card mb-4`}
                style={{
                    overflow: "visible"
                }}>
                <div className='card-title pt-2 m-0 p-0 mb-2'>
                    <Row className='w-100 m-0 p-0' >
                        <Col className='col-2 p-0 d-flex align-items-center justify-content-center'>
                            <Image src={`${creator.image}`}
                                roundedCircle fluid className={`${classes.img}`} />
                        </Col>
                        <Col className='col-5 p-0'>
                            <span className='d-block'>
                                {creator.name}
                                {group &&
                                    <>
                                        <span className='ml-2 mr-2'>
                                            <FontAwesomeIcon icon={faCaretRight} />
                                        </span>
                                        <Link href="#">
                                            <span className='link'>{group.name}</span>
                                        </Link>
                                    </>
                                }
                            </span>
                            <small className='mb- 3'>{date}</small>
                        </Col>
                        <Col className='col-1 offset-3 btn justify-content-center align-items-center'>
                            <LinkDropdown url='' icon={faEllipsisH} setting={true}
                                color='white' />
                        </Col>
                    </Row>
                </div>

                <div className='card-body p-0'>
                    <Row className='m-0 p-0 w-100' >
                        <Col className={`pl-4 col-12 pb-2 pt-3 `}>
                            {body.content}
                        </Col>
                        <div className={`p-0 m-0  w-100`}>
                            <Image src={`upload/${body.img}`} fluid className='w-100' alt='image' />
                        </div>
                    </Row>
                    <div className='pt-3'>
                        <UserInteract commentHandler={commentHandler} id={id} />
                    </div>
                    <div>
                        {show ? <CreateComment postID={id} refComment={''} InitialValue='' replyComment={false} />
                            : null
                        }
                    </div>

                    <div ref={commentContainer}
                        style={{
                            height: "auto"
                        }}
                    >
                        {Comments}
                    </div>

                    {commentOfThisPost.length > 0 && CommentCount?.has(id) &&
                        commentOfThisPost?.length !== CommentCount?.get(id) &&
                        (
                            <div className="row w-100 ml-2">
                                <span className={`column col-6 d-flex justify-content-center align-items-center ${classes.moreComment}`}
                                    onClick={moreCommentHandler}
                                >
                                    View more comments
                                </span>

                                <span className={`column col-6 d-flex justify-content-center align-items-center ${classes.moreComment}`}>
                                    {commentOfThisPost?.length} of {CommentCount?.get(id)}
                                </span>
                            </div>
                        )
                    }
                    {((CommentCount?.get(id) > 6 &&
                        commentOfThisPost?.length > 6)
                        || (
                            CommentCount?.get(id) < 6 &&
                            commentOfThisPost.length > 4
                        )
                    )
                        &&

                        (<div className="row w-100 ml-2 ">

                            <span className={`column col-6 d-flex justify-content-center align-items-center ${classes.moreComment}`}
                                onClick={() => {
                                    window.scrollTo(0,
                                        window.pageYOffset - commentContainer.current.offsetHeight
                                    )
                                }
                                }
                            >
                                Create A Comment...
                            </span>

                        </div>
                        )
                    }

                </div>
            </div>
        </>
    )
}


export default Post
