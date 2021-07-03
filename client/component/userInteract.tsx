import { faCommentAlt, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { State } from '../store'
import classes from './style/userInteract.module.css'
import ReactToPost from './ReactToPost'
import { createReaction, deleteReaction, updateReaction } from '../actions/reactionActions'
import { Col, Row } from 'react-bootstrap'

const UserInteract = ({ commentHandler, id }) => {
    const { reaction, loading, error } = useSelector((state: State) => state.getReaction)

    const [emogi, setEmogi] = useState('👍')
    const [expression, setExpression] = useState('Like')
    const [color, setColor] = useState('white')



    const dispatch = useDispatch()

    useEffect(() => {
        if (reaction && reaction.length > 0) {
            for (let i = 0; i < reaction.length; i++) {
                if (reaction[i].post.id === id) {
                    switch (reaction[i].reaction) {
                        case 'Love':
                            changeReact('❤️', 'Love', 'red', false)
                            break
                        case 'Haha':
                            changeReact('😂', 'Haha', 'yellow', false)
                            break
                        case 'Waw':
                            changeReact('😲', 'Waw', 'yellow', false)
                            break
                        case 'Angry':
                            changeReact('🤬', 'Angry', 'red', false)
                            break
                        case 'Like':
                            changeReact('👍', 'Like', 'blue', false)
                            break
                    }
                }
            }
        }
    }, [reaction])

    // react to a bost throught  the row of reaction  
    const changeReact = (emogi, expression, color, action) => {
        setColor(color)
        setEmogi(emogi)
        setExpression(expression)
        switch (action) {
            case 'create':
                dispatch(createReaction(id, expression))
                break
            case 'delete':
                dispatch(deleteReaction(id))
                break
            case 'update':
                dispatch(updateReaction(id, expression))
                break
            default:
                return
        }

    }


    // react to a bost throught  the button  
    const LikeHandler = () => {
        if (color === 'white') {
            changeReact('👍', 'Like', 'blue', 'create')
        } else {
            changeReact('👍', 'Like', 'white', 'delete')
        }
    }

    const updateReact = (emogi, expression, Color) => {
        if (color === 'white') {
            changeReact(emogi, expression, Color, 'create')
        } else {
            changeReact(emogi, expression, Color, 'update')
        }
    }

    return (
        <>
            <Row>
                <Col>
                </Col>
                <div style={{ height: '40px' }} className='d-flex align-items-end align-items-end pt-2'>
                    <span className={`${classes.statistic}`}>
                        12 comment
                   </span>
                    <span className={`${classes.statistic}`}>
                        1 share
                   </span>
                </div>

            </Row>
            <div className={`${classes.border} d-flex align-items-center mt-2`}>
                <div className={`w-100 ${classes.container}`} >
                    <div className={`row w-100 m-0 h-90 ${classes.interact} `}>
                        <ReactToPost LikeClass={classes.like} emogi={emogi} expression={expression}
                            color={color}
                            LikeHandler={LikeHandler} />

                        < div className={`column col-4 ${classes.comment}`} onClick={commentHandler}>
                            <div className='row h-100 w-100 m-0 p-0 d-flex justify-content-center'>
                                <div className='column mr-2 d-flex align-items-center'>
                                    <FontAwesomeIcon icon={faCommentAlt} color='white' />
                                </div>
                                <div className='column d-flex align-items-center'>
                                    <p className='m-0 p-0' style={{ color: '#b0b3b8' }}>comment</p>
                                </div>
                            </div>
                        </div>
                        <div className={`column col-4 ${classes.share}`}>
                            <div className='row h-100 w-100 m-0 p-0 d-flex justify-content-center'>
                                <div className='column mr-2 d-flex align-items-center'>
                                    <FontAwesomeIcon icon={faShare} color='white' />
                                </div>
                                <div className='column d-flex align-items-center'>
                                    <p className='m-0 p-0' style={{ color: '#b0b3b8' }}>share</p>
                                </div>
                            </div>
                        </div>
                        <div className={`row hover ${classes.emogi}`}>
                            <div className="column col-1 mr-2 ">
                                <h3 onClick={() => updateReact('👍', 'Like', 'blue')}>👍</h3>
                            </div>
                            <div className="column col-1 mr-2">
                                <h3 className={`${classes.h3}`}
                                    onClick={() => updateReact('😂', 'Haha', 'yellow')}>
                                    😂
                            </h3>
                            </div>
                            <div className="column col-1 mr-2"
                                onClick={() => updateReact('❤️', 'Love', 'red')}>
                                <h3>❤️</h3>
                            </div>

                            <div className="column col-1 mr-2"
                                onClick={() => updateReact('😲', 'Waw', 'yellow')}>
                                <h3>😲</h3>
                            </div>
                            <div className="column col-1"
                                onClick={() => updateReact('🤬', 'Angry', 'red')}>
                                <h3>🤬</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserInteract