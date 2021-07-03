import React, { MutableRefObject } from 'react'

import { faAngleLeft, faAngleRight, faArrowLeft, faArrowRight, faCalculator, faEllipsisH, faPause, faPlay, faPlayCircle, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Image } from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import { addStatusSeen } from "../../../actions/statusAsyncActions"
import { setChooseStatus, setSameStoryIndex, setSameStoryWidth } from "../../../actions/statusSyncAction"
import LinkContainer from "../../../component/linkContainer"
import { State } from "../../../store"

import { getStatusViewers } from '../../../actions/statusAsyncActions'


import classes from "./dispayStory.module.css"
import StoryViewers from "./storyViewers"

const DisplayStory = () => {
    const { storyIndex, sameStoryIndex, width: Width } = useSelector((state: State) => state.statusType)
    const { status, loading, error } = useSelector((state: State) => state.getStatus)
    const { myStatus, loading: myLoding, error: myError } = useSelector((state: State) => state.myStatus)
    /// 
    const [width, setWidth] = useState(0)
    const [timer, setTimer] = useState(false)
    const [play, setPlay] = useState(true)
    const [voice, setVoice] = useState(true)
    // const [index, setIndex] = useState(1)

    // 
    const audioRef = React.useRef<HTMLAudioElement | null>(null)

    let timeoutHandle
    //

    const limit = 100 * status[storyIndex - 1]?.statusCreator.length

    const dispatch = useDispatch()


    useEffect(() => {
        if (play && width < limit) {
            timeoutHandle = window.setTimeout(() => {
                setWidth(previousWidth => previousWidth + 3.3)
            }, 1000)
        }

        return () => {
            window.clearTimeout(timeoutHandle)
        }

    }, [timer, play])

    useEffect(() => {
        if (width < limit) {
            setTimer(!timer)
        }
        if (width && width > limit) {
            if (sameStoryIndex < status[storyIndex - 1]?.statusCreator.length) {
                dispatch(setChooseStatus(storyIndex + 1))
            } else {
                dispatch(setChooseStatus(1))
            }
            dispatch(setSameStoryIndex(1))
            setWidth(0)
        }
        if (width > 100 * sameStoryIndex && width < limit) {
            dispatch(setSameStoryIndex(sameStoryIndex + 1))
        }
        return () => {
            window.clearTimeout(timeoutHandle)
        }


    }, [width])



    useEffect(() => {
        setWidth(Width)
    }, [Width, storyIndex])


    useEffect(() => {
        if (storyIndex === 1 && myStatus) {
            dispatch(getStatusViewers(
                status[storyIndex - 1]?.statusCreator[sameStoryIndex - 1]?.id
            ))
        }
        if (storyIndex > 1 &&
            !status[storyIndex - 1].statusCreator[sameStoryIndex - 1]?.visitor
            // not seen this post before send a post to add seen
        ) {
            dispatch(addStatusSeen(status[storyIndex - 1].statusCreator[sameStoryIndex - 1]?.id))
        }
        window.clearTimeout(timeoutHandle)

        timeoutHandle = window.setTimeout(() => {
            setWidth(previousWidth => previousWidth + 2.5)
        }, 2000)
        audioRef.current.load()

        audioRef.current.play()
        return () => {
            window.clearTimeout(timeoutHandle)
        }
    }, [sameStoryIndex, storyIndex])

    const stopGoingHandler = () => {
        setPlay(!play)
        if (play) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
    }

    const arrowRightHandler = () => {
        dispatch(setSameStoryIndex(sameStoryIndex + 1))
        setWidth(prevWidth => (Math.floor(prevWidth / 100) + 1) * 100)
    }

    const arrowLeftHandler = () => {
        dispatch(setSameStoryIndex(sameStoryIndex - 1))
        setWidth(prevWidth => (Math.floor(prevWidth / 100) - 1) * 100)
    }

    const voiceHandler = () => {
        setVoice(!voice)

        audioRef.current.muted = !audioRef.current.muted
    }

    const statusBar = status[storyIndex - 1]?.statusCreator.map((Status, index) => {
        let finalWidth, value = Math.floor(width / 100)


        if (index < value) {
            finalWidth = 100
        } else {
            if (index === value) {
                if (index === 0) {
                    finalWidth = width
                } else {
                    finalWidth = width % 100
                }
            } else {
                finalWidth = 0
            }
        }
        return (
            <div className={`${classes.bar}`}
                style=
                {{
                    width: `calc(100% / 
                    ${status[storyIndex - 1]?.statusCreator.length +
                        0.2 * status[storyIndex - 1]?.statusCreator.length})`,
                    marginRight: '2px'

                }}
                key={index}
            >
                <div className="progress" style={{ height: "4px" }}>
                    <div className="progress-bar" role="progressbar"
                        style={{
                            width: `${finalWidth}%`,
                            backgroundColor: "#fff",
                            transform: "scale(1.25)"
                        }}
                        aria-valuenow={width} aria-valuemin={0}
                        aria-valuemax={100}>
                    </div>
                </div>
            </div>
        )
    })


    return (
        <>
            <div className={`column col-${myStatus && storyIndex === 1 ? 5 : 9}`} style={{
                backgroundColor: "black",
                zIndex: 1000
            }}>
                <div className={`${classes.StatusContainer}`}
                    style={{
                        backgroundImage: `url('${status[storyIndex - 1]?.statusCreator[sameStoryIndex - 1]?.body.img}')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "rgba(255,255,255,0.4)",
                    }}
                >

                    <audio
                        style={{
                            display: "none"
                        }}
                        ref={audioRef}
                    >
                        <source
                            src={
                                status[storyIndex - 1]?.statusCreator[sameStoryIndex - 1]?.body.audio
                            }
                        />
                    </audio>

                    <div className="row w-60 pt-3 ml-4"
                        style={{ height: "40px" }}
                    >
                        {statusBar}
                    </div >


                    <div className="row w-100 ml-1"
                        style={{ height: "50px" }}
                    >
                        <div className="column col-8 d-flex align-items-center 
                    justify-content-start">
                            <Image src={status[storyIndex - 1]?.image} roundedCircle fluid
                                style={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            />
                            <span className={`${classes.span}`}>
                                {status[storyIndex - 1]?.name}
                            </span>
                        </div>

                        <div className="column col-4 d-flex align-items-center justify-content-end">
                            <div onClick={stopGoingHandler}
                                style={{
                                    zIndex: 10000
                                }}
                            >
                                {!play ?
                                    <FontAwesomeIcon icon={faPlay}
                                        className={`${classes.icon}`}
                                    />

                                    :
                                    <FontAwesomeIcon icon={faPause}
                                        className={`${classes.icon}`}
                                    />
                                }
                            </div>

                            <div onClick={voiceHandler}
                                style={{
                                    zIndex: 10000
                                }}
                            >
                                {voice ?
                                    <FontAwesomeIcon icon={faVolumeUp}
                                        className={`${classes.icon}`}
                                    />
                                    :
                                    <FontAwesomeIcon icon={faVolumeMute}
                                        className={`${classes.icon}`}
                                    />
                                }
                            </div>

                            <div>
                                <FontAwesomeIcon icon={faEllipsisH}
                                    className={`${classes.icon}`}
                                />
                            </div>
                        </div>

                        <div className={`${classes.contentContainer}`}>
                            <span className={`span ${classes.contentSpan}`}>
                                {status[storyIndex - 1]?.statusCreator[sameStoryIndex - 1]?.body.content}
                            </span>
                        </div>

                    </div>

                </div>
                {sameStoryIndex !== status[storyIndex - 1]?.statusCreator.length
                    && <div className={`${classes.arrowRightContainer}`}
                        style={{
                            left: myStatus && storyIndex === 1 ? '85%' : '71%',
                        }}
                    >
                        <LinkContainer icon={faArrowRight} color='#fff' setting={true}
                            onChange={arrowRightHandler} url=''
                        />
                    </div>
                }

                {sameStoryIndex !== 1 &&
                    <div className={`${classes.arrowLeftContainer}`}
                        style={{
                            left: myStatus && storyIndex === 1 ? "9%" : "25%",
                        }}

                    >
                        <LinkContainer icon={faArrowLeft} color='#fff' setting={true}
                            onChange={arrowLeftHandler}
                            url=''
                        />
                    </div>
                }

                {(!myStatus || storyIndex !== 1) &&
                    <div className="row w-100">
                        <div className={`column col-5 ${classes.inputContainer}`} >
                            <input className={`${classes.input}`}
                                placeholder='Reply ... '
                            />
                        </div>
                        <div className={`column col-7 ${classes.emogyContainer}`}>
                            <Image src={'/emogy/Love.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/Like.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/care.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/funny.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/wow.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/sad.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />
                            <Image src={'/emogy/angry.png'}
                                fluid roundedCircle
                                className={`${classes.emogy}`}
                            />

                        </div>
                    </div>}

            </div>
            <StoryViewers myStory={status[storyIndex - 1]?.statusCreator} />
        </>
    )
}

export default DisplayStory
