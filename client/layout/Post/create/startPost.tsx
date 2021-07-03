import { faImage, faSmile, faVideo } from "@fortawesome/free-solid-svg-icons"
import ImageContainer from "../../../component/Image"
import Navigate from "../../../component/navigate"

const StartPost = ({startPost}) => {
    return (
        <div className='card mb-4 w-100' style={{height: '150px'}} >
            <div className="card-title p-3 ">
                <div className='row w-100' onClick = {startPost} style = {{cursor  :'pointer'}}>
                    <div className='column col-2'>
                        <ImageContainer src='/default.jpg' />
                    </div>
                    <div className='column col-10 '>
                        What is your mind mohsin ?
                    </div>
                </div>
            </div>

            <div className="card-body" style = {{borderTop : '0.4px solid gray'}}>
                <div className='row'>
                    <div className='column col-4 m-0 p-0 d-flex align-items-center justify-content-center'>
                        <Navigate img='' icon={faVideo} text='Live/Video' color='red' />
                    </div>
                    <div className='column col-4 m-0 p-0 d-flex align-items-center justify-content-center'>
                        <Navigate img='' icon={faImage} text='Phto/Video' color='green' />
                    </div>
                    <div className='column col-4 m-0 p-0 d-flex align-items-center justify-content-center'>
                        <Navigate img='' icon={faSmile} text='Feeling' color='yellow' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartPost
