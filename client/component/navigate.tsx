import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Image} from 'react-bootstrap'
import classes from './style/navigate.module.css'

const Navigate = ({ img, text , icon , color  }) => {
    return ( 
        <div className={`row mt-2 ${classes.height}`}>
            <div className='column col-2  d-flex align-items-center'>
                {img ? <Image src={img} roundedCircle className = {`${classes.img}`}
                    width={28} height={28} /> : null}
                {icon  ? (<FontAwesomeIcon icon = {icon} color ={color} 
                    style = {{fontSize : '25px'}}
                />) : null }
            </div>
            <div className='column d-flex align-items-center ml-3'>
                <div className={`text-center ${classes.text}`}>{text}</div>
            </div>
        </div>
    )
}

export default Navigate
