import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const EmptyStoryChoose = () => {
    return (
        <div className="column col-9">
            <div className='row w-100 h-100 d-flex align-items-center justify-content-center'>
                <div className='position-relative d-flex align-items-start justify-content-center'
                    style={{ height: "169px", width: "257px" }}
                >
                    <FontAwesomeIcon icon={faCamera}
                        style={{ fontSize: '100px', display: 'block' }} />
                    <span style={{
                        fontSize: "16pt",
                        position: 'absolute',
                        bottom: '23%',
                        left: '18%'
                    }}>
                        Select a story to open
                            </span>
                </div>


            </div>
        </div>
    )
}

export default EmptyStoryChoose
