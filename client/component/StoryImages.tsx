import { useEffect } from "react"
import { Image } from "react-bootstrap"

import classes from './style/StoryImages.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { setStatusImage } from "../actions/statusSyncAction"
import { wrapper } from "../store"
import { SET_STATUS_IMAGE } from "../constants/statusConstants"


const StoryImages = () => {
    const Images: JSX.Element[] = []


    const dispatch = useDispatch()
    return (
        <div className={`${classes.container} row`}>
            <div>
                <span className={`${classes.span}`}>Backgrounds</span>
                <div className={`${classes.img}`}
                    onClick={() => dispatch(setStatusImage('/StatusImage/image1.jpg'))}
                >
                    <Image src={`/StatusImage/image1.jpg`}
                        roundedCircle fluid width={20} height={20}
                    />
                </div>
                <div className={`${classes.img}`}
                    onClick={() => dispatch(setStatusImage('/StatusImage/image2.jpg'))}
                >
                    <Image src={`/StatusImage/image2.jpg`}
                        roundedCircle fluid width={20} height={20}
                    />
                </div>
                <div className={`${classes.img}`}
                    onClick={() => dispatch(setStatusImage('/StatusImage/image3.jpg'))}
                >
                    <Image src={`/StatusImage/image3.jpg`}
                        roundedCircle fluid width={20} height={20}
                    />
                </div>
                <div className={`${classes.img}`}
                    onClick={() => dispatch(setStatusImage('/StatusImage/image4.jpg'))}
                >
                    <Image src={`/StatusImage/image4.jpg`}
                        roundedCircle fluid width={20} height={20}
                    />
                </div>
                <div className={`${classes.img}`}
                    onClick={() => dispatch(setStatusImage('/StatusImage/image5.jpg'))}
                >
                    <Image src={`/StatusImage/image5.jpg`}
                        roundedCircle fluid width={20} height={20}
                    />
                </div>
            </div>
        </div >
    )
}

export default StoryImages
