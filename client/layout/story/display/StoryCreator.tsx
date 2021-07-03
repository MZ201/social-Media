import { useEffect } from "react"
import { Image } from "react-bootstrap"
import { State } from "../../../store"
import { useSelector, useDispatch } from 'react-redux'
import { setChooseStatus, setSameStoryIndex, setSameStoryWidth } from "../../../actions/statusSyncAction"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import classes from './StoryCreator.module.css'
import { addStatusSeen, getStatusViewers } from "../../../actions/statusAsyncActions"

const StoryCreator = ({ id, img, name, time, nonSeenStory, myStory }) => {
    const { status } = useSelector((state: State) => state.getStatus)

    const { storyIndex, sameStoryIndex } = useSelector((state: State) => state.statusType)

    const dispatch = useDispatch()



    return (
        <div className={`row  ${classes.container}`}
            onClick={() => {
                const findIndex = status.findIndex(elm => elm.id === id)
                dispatch(setSameStoryWidth(0))
                dispatch(setChooseStatus(findIndex + 1))
                dispatch(setSameStoryIndex(1))

            }}
        >
            <div className="column col-2 mr-3 mt-1 align-items-center justify-content-center">
                <div style={{
                    height: '60px', width: "60px", borderRadius: "50%",
                    border: nonSeenStory !==0 ? '2px solid #2e89ff' : '3px solid #3E4042'
                }}
                    className='d-flex align-items-center justify-content-center'
                >
                    <Image src={img} fluid roundedCircle
                        style={{
                            height: "55px", width: "55px", transform: "scale(0.91)"
                        }}
                    />

                </div>
            </div>
            <div className="column col-6">
                <span style={{
                    fontSize: "12pt", display: 'block'
                    , marginTop: "0.6rem"
                }}>{name}</span>
                <span style={{
                    fontSize: "10pt"
                    , color: "#2e89ff"
                }}>{nonSeenStory} new</span>
                <span style={{ margin: "0 5px 0 5px" }}>.</span>
                <span style={{ fontSize: "10pt" }}>{time}</span>

            </div>
            <div className="column col-2 mt-1">
                {myStory && <span className={`${classes.plus}`}>
                    <FontAwesomeIcon icon={faPlus}
                        style={{ fontSize: "20px", color: 'blue' }} />
                </span>}
            </div>

        </div>

    )
}

export default StoryCreator
