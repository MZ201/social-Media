import { Dispatch, useEffect, useState } from "react"
import NavBar from "../../layout/NavBar"
import DisplayStory from "../../layout/story/display/displayStory"
import EmptyStoryChoose from "../../layout/story/display/EmptyStoryChoose"
import StoryDash from "../../layout/story/display/StoryDash"


import { useSelector, useDispatch } from 'react-redux'
import { State, wrapper } from "../../store"
import { getMyStatus, getStatus } from "../../actions/statusAsyncActions"
import { NextPage } from "next"
import socket from "../../socket/socket"
import { useRouter } from "next/router"
import { getClient } from "../../actions/userActions"


export const getServerSideProps = wrapper.getServerSideProps(store =>
    async (context) => {

        const { req } = context
        const dispatchStore = store.dispatch as typeof store.dispatch | Dispatch<any>

        await dispatchStore(getStatus(req.headers))
        
        await dispatchStore(getClient(req.headers))

        await dispatchStore(getMyStatus(req.headers))

        return {
            props: { sessionID: req.cookies.session || null}
        }

    }
);

const stories = ({sessionID ,req }) => {

    const { status, loading, error } = useSelector((state: State) => state.getStatus)
    
    const { client , error : CientError } = useSelector((state: State) => state.getClient)


    const { myStatus, loading: myLoding, error: myError } = useSelector((state: State) => state.myStatus)

    const { storyIndex } = useSelector((state: State) => state.statusType)

    const dispatch = useDispatch()

    const router = useRouter()
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
        <div className='container-fluid ' style={{
            backgroundColor: "black",
            overflow: 'hidden',
            width: "104%"
        }}>
            <div className='row w-100'
                style={{ height: "100vh" }}>
                <StoryDash />
                {!storyIndex && <EmptyStoryChoose />}
                {storyIndex >= 0 && <DisplayStory />}
            </div>
        </div >
    )
}



export default stories