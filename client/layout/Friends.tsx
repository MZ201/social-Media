import { faVideo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Image } from "react-bootstrap"
import classes from './style/friends.module.css'

const Friends = () => (
    <>

        <div className={`row  w-100 ${classes.container}`} >
            <div className={`${classes.imageContainer}`}>
                <Image src='/upload/logo.jpg'
                    width={28} height={28} roundedCircle />

                <span className={`${classes.span}`}>
                </span>
            </div>
            < div className='column d-flex align-items-center ' >
                mohsin zouhri
        </div>
        </div>
    </>

)

export default Friends
