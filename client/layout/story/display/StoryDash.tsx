import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { ADJUST_STATUS_BY_SOCKET } from "../../../constants/statusConstants"
import socket from "../../../socket/socket"
import { State } from "../../../store"

import StoryCreator from "./StoryCreator"

import classes from './StoryDash.module.css'

const StoryDash = () => {
    const { status, loading, error } =
        useSelector((state: State) => state.getStatus)

    const { myStatus, loading: myLoding, error: myError } =
        useSelector((state: State) => state.myStatus)

    const dispatch = useDispatch()

    //    console.log(status)



    const Status = status?.map((user, index) => {
        const newStory = user.statusCreator?.filter(status => status.visitor !== true)
        if (myStatus && index === 0) {
            return;
        } else {
            return <StoryCreator
                id={user.id}
                name={user.name}
                img={user.image}
                nonSeenStory={newStory?.length}
                time={
                    user.statusCreator[0]?.createdAt.substring(11, 16)}
                key={user.id}
                myStory={false}
            />
        }
    })


    useEffect(() => {
        // idea every time i wanna connected I provide my SessionID. 

        socket.on('statusCreated', (createdStatus) => {
            dispatch({
                type: ADJUST_STATUS_BY_SOCKET,
                payload: createdStatus
            })
        })

       
    }, [dispatch , socket])

    return (
        <div className="column col-3" style=
            {{
                backgroundColor: '#242526', height: "100%",
                zIndex: 1000,
                maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden'
            }}>
            <div className={`row`} style={{ height: '70px', marginTop: '0.2rem' }}>
                <div className="column col-6 d-flex align-items-start justify-content-start">
                    <div className={`${classes.Stories}`}>Stories</div>
                </div>
                <div className="column col-6 d-flex align-items-start justify-content-center mt-2">
                    <span className={`${classes.blue}`}>archive</span>
                    .
                    <span className={`${classes.blue}`}>Setting</span>
                </div>
            </div>

            <div className="row d-flex alig-items-center"
                style={{
                    height: '37px',
                }}>
                <span className=' ml-3'
                    style={{ fontSize: "15pt" }}
                >
                    Your Story
                </span>
            </div>
            {myStatus &&
                <StoryCreator
                    id={myStatus?.id}
                    img={myStatus?.image}
                    name={myStatus?.name}
                    time={myStatus?.statusCreator ? myStatus.statusCreator[0].createdAt.substring(11, 16) : ''}
                    nonSeenStory={false}
                    myStory={true}
                />
            }

            {!myStatus &&
                <div className={`row mt-3`} style={{ height: '76px' }}>
                    <div className="column col-2 ">
                        <span className={`${classes.plus}`}>
                            <FontAwesomeIcon icon={faPlus}
                                style={{ fontSize: "20px", color: 'blue' }} />
                        </span>
                    </div>
                    <div className="column col-7">
                        <span style={{
                            fontSize: '14pt', display: "block",
                            marginLeft: "0.7rem", marginTop: "0.3rem"
                        }}>
                            Create a story
                        </span>
                        <span style={{
                            fontSize: "10pt",
                            marginLeft: "0.6rem",
                            width: "150%",
                            display: "block"
                        }}>
                            share a photo or write something
                        </span>
                    </div>
                </div>
            }

            <div className="row" style={{
                marginLeft: '0.2rem', height: "40px"
                , marginTop: '0.2rem'
            }}>
                <span style={{ fontSize: "15pt" }}>
                    All Stories
                </span>
            </div>
            {Status}
        </div>

    )
}

export default StoryDash
