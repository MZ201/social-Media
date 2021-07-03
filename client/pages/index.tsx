import { faWatchmanMonitoring } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight, faCalendar, faCamera, faEllipsisH, faLayerGroup, faMapMarkedAlt, faSearch, faStar, faTv, faUserFriends, faUsers, faVideo } from '@fortawesome/free-solid-svg-icons'
import { Carousel, Image } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Dispatch, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts } from '../actions/postActions'
import { getReaction } from '../actions/reactionActions'

import Navigate from "../component/navigate"
import CreatePost from '../layout/Post/create/CreatePost'
import NavBar from "../layout/NavBar"
import Post from "../layout/Post/display/Post"
import Status from "../layout/Status"
import StartPost from '../layout/Post/create/startPost'
import { State, wrapper } from '../store'
import Friends from '../layout/Friends'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import socket from '../socket/socket'




import classes from '../styles/Home.module.css'
import { getStatus } from '../actions/statusAsyncActions'
import { setChooseStatus, setSameStoryIndex } from '../actions/statusSyncAction'
import { ADJUST_STATUS_BY_SOCKET } from '../constants/statusConstants'
import { getClient } from '../actions/userActions'



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



const Home = ({ sessionID }) => {
    const [createPost, setCreatePost] = useState(false)

    const { client , error : CientError } = useSelector((state: State) => state.getClient)
    const { posts } = useSelector((state: State) => state.getPosts)
    const { status } = useSelector((state: State) => state.getStatus)
    const { userInfo, loading } = useSelector((state: State) => state.userLogin)
    const { reaction } = useSelector((state: State) => state.getReaction)
    const dispatch = useDispatch()

    const router = useRouter()

    let Posts = []
    useEffect(() => {
        if (!sessionID) {
            router.push('/login')
        }
        if (sessionID) {
            dispatch(getPosts())
            dispatch(getReaction())
            dispatch(getStatus(null))
            socket.auth = {
                client
            }
            socket.connect()
        }

        return () => {
        }
    }, [router])

    // posts
    if (posts && posts.length > 0) {
        Posts = posts.map((post, index) => {
            const body = JSON.parse(JSON.stringify(post.body))

            return <Post key={post.id} creator={post.pageRoom ? post.pageRoom : post.creator}
                date={post.createdAt}
                body={body} id={post.id} group={post.groupRoom} />
        })
    }

    // Status

    const StatusShort = status?.map((story, index) => {
        return (<Status
            key={index}
            name={story.name}
            image={story.image}
            last={index === status.length - 1 ? true : false}
            bgImage={story.statusCreator[story.statusCreator.length - 1].body.img}
            clickHandler={() => {
                dispatch(setChooseStatus(index + 1))
                dispatch(setSameStoryIndex(1))
                router.push('/stories/')
            }}
        />)
    }
    )

    return (
        <>
            {!loading && (
                <div className='container-fluid' >
                    <div style={{ height: "60px" }}></div>
                    <NavBar />
                    <div className='row' style={{ opacity: createPost ? '0.3' : '1' }}>
                        <div className='column col-3 '></div>
                        <div className='column col-3  p-0 ml-1 position-fixed'
                        >
                            <div
                                style={{
                                    overflowY: 'scroll', overflowX: 'hidden',
                                    width: "83%"
                                }}

                            >
                                <Navigate img='/upload/kalhonaaho.jpeg' text='mohsin zouhri' icon='' color='' />
                                <Navigate img='/covid.png' text='Covid 19 information' icon='' color='green' />
                                <Navigate img='/friends.png' text='Friends' icon='' color='green' />
                                <Navigate img='/groups.png' text='Groups' icon='' color='green' />
                                <Navigate img='/watch.png' text='Watch' icon='' color='green' />
                                <Navigate img='/market.png' text='Market' icon='' color='green' />
                                <Navigate img='/events.png' text='Event' icon='' color='green' />
                                <Navigate img='/memories.png' text='Memories' icon='' color='green' />
                                <Navigate img='/save.png' text='Save' icon='' color='green' />
                            </div>
                        </div>

                        <div className='column col-5  justify-content-center'

                            style={{
                                marginLeft: '7rem'
                            }}
                        >

                            <div
                                style={{
                                    width: "90%"
                                }}
                            >
                                <div className='mt-2 d-flex  aling-items-center justify-content-center'>
                                    <Status
                                        bgImage={`/StatusImage/image5.jpg`}
                                        image={'/covid.png'}
                                        last={false}
                                        name='Create Story'
                                        clickHandler={
                                            () => {
                                                router.push('/stories/create')
                                            }
                                        }
                                    />
                                    {StatusShort}
                                </div>

                                <div className=''>
                                    <StartPost startPost={() => setCreatePost(!createPost)} />
                                    {Posts}
                                </div>
                            </div>
                        </div>
                        <div className='column col-2 position-fixed' style={{ right: '10px' }}>
                            <div className={`row w-100 mb-2`}>
                                <div className='column col-6 d-flex align-items-center' style={{
                                    fontWeight: 600,
                                    fontSize: '1.0625rem',
                                }}>
                                    Contacts
                                </div>
                                <div className={`column col-2 ${classes.icon}`}>
                                    <FontAwesomeIcon icon={faVideo} />
                                </div>

                                <div className={`column col-2 ${classes.icon}`}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </div>

                                <div className={`column col-2 ${classes.icon}`}>
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </div>
                            </div>

                            <Friends />
                            <Friends />
                            <Friends />
                            <Friends />
                            <Friends />
                        </div>
                    </div>
                    {createPost ?
                        <div className='modal'>
                            {createPost ? <CreatePost closeModel={() => setCreatePost(false)} /> : null}
                        </div>
                        : ''}
                </div>)
            }
        </>
    )
}

export default Home
