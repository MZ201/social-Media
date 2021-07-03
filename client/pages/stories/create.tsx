
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faBell, faChevronCircleDown, faCog, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from 'react-redux'

import { Image } from 'react-bootstrap'
import LinkContainer from '../../component/linkContainer'
import ChooseStatus from '../../layout/story/create/ChooseStatus'
import CreateStory from '../../layout/story/create/CreateStory'
import StoryParametre from '../../layout/story/create/StoryParametre'
import { Dispatch, useEffect } from 'react'
import { State } from '../../store'
import { useRouter } from 'next/router'
import { createStatus } from '../../actions/statusAsyncActions'

import classes from '../../styles/create/create.module.css'
import socket from '../../socket/socket'

import { wrapper } from '../../store'
import { getClient } from '../../actions/userActions'

export const getServerSideProps = wrapper.getServerSideProps(store =>
    async (context) => {

        const { req } = context
        const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>


        await dispatchStore(getClient(req.headers))

        return {
            props: { sessionID: req.cookies.session || null }
        }

    }
);



const create = ({ sessionID }) => {
    let pageRoom, groupRoom;
    const { loading, success, error } = useSelector((state: State) => state.createStatus)
    const { choose, content, img, audio } = useSelector((state: State) => state.statusType)
    const { client , error : CientError } = useSelector((state: State) => state.getClient)
    const router = useRouter()

    let body = {
        content, img, audio
    }
    const dispatch = useDispatch()


    const createStatusHandler = () => {
        dispatch(createStatus(body, pageRoom = undefined, groupRoom = undefined))
        router.push('/stories/')
    }

    useEffect(() => {
        if (sessionID) {
            if (!socket.open().connected) {
                socket.auth = {client}
                socket.connect()
            }
        } else {
            router.push('/login')
        }

    }, [socket])

    return (
        <div className='container-fluid' style={{
            overflow: 'hidden',
        }}>
            <div className='row'>
                <div className='column col-lg-3 col-md-4 col-sm-12' style={{ backgroundColor: '#242526', height: "100vh" }}>
                    <div className='row'>
                        <span className={`${classes.span}`}>
                            <FontAwesomeIcon icon={faTimes} style={{ fontSize: "20px" }} color='#ffffff' />
                        </span>
                        <span className={`${classes.span}`}>
                            <FontAwesomeIcon icon={faFacebook} size='3x' color='blue' />
                        </span>
                    </div>

                    <div className='row mb-3'>
                        <div className='column col-8'>
                            <h4 className='mt-2'>Your Story </h4>
                        </div>
                        <div className='column col-4 d-flex align-items-center justify-content-end'>
                            <div className={`${classes.setting}`}>
                                <FontAwesomeIcon icon={faCog} size='lg' />
                            </div>
                        </div>
                    </div>
                    <div className={`row pb-2 ${classes.border}`}>
                        <div className='column m-2'>
                            <Image src='/upload/kalhonaaho.jpeg' width={60} height={60}
                                roundedCircle />
                        </div>
                        <div className='column d-flex justify-content-center align-items-center'>
                            <h5 style={{ fontSize: '14pt' }}>mohsin zouhri</h5>
                        </div>
                    </div>

                    {choose && img && <StoryParametre />}


                    {choose &&
                        (<div className={`${classes.btnContainer}`}>
                            <button className={`${classes.discardBtn}`}>
                                Discard
                            </button>

                            <button className={`${classes.shareBtn}`}
                                onClick={createStatusHandler}
                            >
                                Share to Story
                            </button>
                        </div>)
                    }
                </div>
                <div className='column col-lg-9 col-md-8'
                >
                    <div className='row'>
                        <div className='column col-4 offset-8'>
                            <div className="row" style={{ height: "50px" }}>
                                <div className="column col-2 offset-6">
                                    <LinkContainer url='#' icon={faPlus} setting={true}
                                        color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                                </div>
                                <div className="column col-2">
                                    <LinkContainer url='#' icon={faBell} setting={true}
                                        color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                                </div>
                                <div className="column col-2">
                                    <LinkContainer url='#' icon={faChevronCircleDown} setting={true}
                                        color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!img && <ChooseStatus />}

                    {choose && img && <CreateStory />}

                </div>
            </div>

        </div>
    )
}

export default create
