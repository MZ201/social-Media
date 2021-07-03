import { faBell, faChevronCircleDown, faEye, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import LinkContainer from '../../../component/linkContainer'
import classes from './storyViewers.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { setSameStoryIndex, setSameStoryWidth } from '../../../actions/statusSyncAction'
import { State } from '../../../store'
import StoryCreator from './StoryCreator'

const StoryViewers = ({ myStory }) => {
    const [scaleIndex, setScaleIndex] = useState(0)
    const [lastValue, setLastValue] = useState(null)

    const { storyIndex, sameStoryIndex } = useSelector((state: State) => state.statusType)
    const { myStatus, loading:
        myLoding, error: myError } = useSelector((state: State) => state.myStatus)


    const { viewers, loading: VieLoading, error: VieError } =
        useSelector((state: State) => state.getViewers)

    const dispatch = useDispatch()

    const Viewers = viewers?.map(viewer =>
        <div className="row w-100">
            <StoryCreator
                id={viewer.id}
                name={viewer.name}
                img={viewer.image}
                nonSeenStory=''
                time=''
                myStory=''
            />
        </div>
    )


    useEffect(() => {
        if (myStory?.length >= scaleIndex + 2) {
            setLastValue(`translate(${-102 * scaleIndex}px ,0)`)
        }
    }, [scaleIndex])


    useEffect(() => {
        setScaleIndex(sameStoryIndex - 1)
    }, [sameStoryIndex])



    const stories = myStory?.map((story, index) => {
        return (
            <div key={index} className={`${classes.scaleContainer}`}>
                <div className={`${classes.storyContainer}`}
                    onClick={() => {
                        dispatch(setSameStoryWidth(index * 100))
                        dispatch(setSameStoryIndex(index + 1))
                    }
                    }
                    style={{
                        backgroundImage: `url('${story?.body.img}')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: "rgba(255,255,255,0.4)",
                        transform: index === scaleIndex ? `scale(1.2)` : 'scale(1)'
                    }}
                >
                    <span className={`${classes.content}`}>{story?.body.content}</span>
                </div>
            </div>
        )
    })


    return (
        <div className={`column col-${myStatus && storyIndex === 1 ? 4 : 0} ${classes.container}`}>
            <div className="row" style={{ height: "50px" }}>
                <div className="column col-2 offset-5">
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

            <div className="row">
                <span className={`${classes.span}`}>Story Details</span>
            </div>

            <div className={`${classes.storiesContainer}`}
                style={{
                    width: `${(myStory?.length + 1) * 100}%`,
                    transform: myStory?.length >= scaleIndex + 2 ?
                        `translate(${-102 * scaleIndex}px ,0)` :
                        lastValue
                }}
            >
                {stories}
                <div className={`${classes.createStoryContainer}`}>
                    <div className={`${classes.plusContainer}`}>
                        <span className={`${classes.plus}`}>
                            <FontAwesomeIcon icon={faPlus}
                                style={{ fontSize: "20px", color: 'blue' }} />
                        </span>
                    </div>
                    <span className={`${classes.createStory}`}>create Story</span>
                </div>
            </div>

            {viewers?.length > 0 && Viewers}

            {(!viewers || viewers.length === 0 ) && (
                <>
                    <div className='row w-100'>
                        <div className="column col-1 mr-3 align-items-center">
                            <FontAwesomeIcon icon={faEye}
                                style={{ fontSize: '30px' }}
                            />
                        </div>
                        <div className="column col-10 align-items-center">
                            <span style={{ fontSize: '14pt', wordSpacing: '2px' }}>No Viewers Yet</span>
                        </div>
                    </div>

                    <div className='row'>
                        <span style={{ fontSize: "12pt", margin: '10px 0 0 10px' }}>
                            As people view your story, you'll see details here.
                    </span>
                    </div>
                </>
                )
            }

        </div>
    )
}

export default StoryViewers
