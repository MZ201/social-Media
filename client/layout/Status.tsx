import { faArrowAltCircleRight, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { Image } from 'react-bootstrap'
import classes from './style/Status.module.css'
import styled from 'styled-components';


const StatusContainer = styled.div`
        width : 111.59px;
        height: 198.38px; 
        margin: 0 10px 10px 0 ;
        display: inline-block;
        position: relative;
        cursor: pointer;

        &::after{
            content:  '';
            background-image: url(${props => props.bgImage});
            background-size: cover;
            background-origin: center;
            position: absolute;
            top:0; 
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.7;
            border-radius: 5px;
        }
`



const Status = ({ last, bgImage, image, name , clickHandler }) => {
    const router = useRouter()

    return (

        <StatusContainer bgImage={bgImage}  onClick = {clickHandler}>
            <div>
                <Image src={`${image}`} className={`${classes.img}`} fluid />
            </div>

            <span className={`${classes.name}`}>{name}</span>

            {last &&
                <span className={`${classes.span}`}
                    onClick={() => router.push('/stories/')}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </span>
            }            

        </StatusContainer>
    )
}
export default Status
