import {
    faComments, faEllipsisH,
    faImage,
    faMapMarker, faSmile, faTimes, faUserFriends
} from "@fortawesome/free-solid-svg-icons"
import LinkContainer from "../../../component/linkContainer"
import classes from "./CreatePost.module.css"
import axios from 'axios'
import { UiFileInputButton } from "../../../component/UiFileInputButton"
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { createPost } from "../../../actions/postActions"

const CreatePost = ({ closeModel }) => {
    const [body, setBody] = useState({ content: '', img: '', video: '', audio: '' })
    const dispatch = useDispatch()
    const onChange = async (formData, fileInfo) => {
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
        console.log('nice')

        try {
            const { data } = await axios.post('/api/upload', formData, config);
            setBody({ ...body, img: fileInfo[0].name })
        } catch (err) {
            console.log(err)
        }
    };

    const onClickHandler = () => {
        dispatch(createPost(body))
        closeModel()
    }
    return (
        <div className={`card ${classes.card}`} style={{ backgroundColor: 'rgb(36,37,38)', zIndex: 300 }}>
            <div className={`card-title  ${classes.border}`}>
                <div className='row h-100'>
                    <div className='column col-8 d-flex align-items-center justify-content-end'>
                        <h5 className='text-center'>Create Post</h5>
                    </div>

                    <div className="column col-4 d-flex justify-content-end align-items-center jusify-content-center">
                        <LinkContainer url='' icon={faTimes} setting={true} color='white'
                            onChange={closeModel} />
                    </div>
                </div>
            </div>
            <div className='card-body'>
                <div className='row'>
                    <div className='column col-2'>
                        <img src='/default.jpg' className={`img-fluid ${classes.img}`} width={45}
                            height={45} />
                    </div>
                    <div className='column text-center'>
                        <h5 className=''>mohsin Zouhri</h5>
                    </div>
                </div>
                <div className={`row ${classes.input_area}`}>
                    <div className='column w-100'>
                        <textarea className={`txta ${classes.input}`}
                            placeholder='mohsin , what is in your mind?' rows={5}
                            onChange={e => setBody({ ...body, content: e.target.value })}>
                        </textarea>
                    </div>
                    {body.img && (<div className={`column ${classes.scroll}`}>
                        <img src={`/upload/${body.img}`} alt='' className='img-fluid'
                        />
                    </div>)}
                </div>
                <div className={`row ${classes.interact}`}>
                    <div className='column col-4 d-flex align-items-center justify-content-center'>
                        <h6 className=''>Add A post</h6>
                    </div>
                    <div className='column col-8'>
                        <div className='row d-flex'>
                            <div className='column col-2 form-group'>
                                <UiFileInputButton
                                    label="Upload Single File"
                                    uploadFileName="theFiles"
                                    onChange={onChange}
                                    for = 'CREATE_POST'
                                />

                            </div>

                            <div className='column col-2'>
                                <LinkContainer url='' icon={faUserFriends} setting={true} color='blue' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2'>
                                <LinkContainer url='' icon={faSmile} setting={true} color='yellow' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2'>
                                <LinkContainer url='' icon={faMapMarker} setting={true} color='orange' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2'>
                                <LinkContainer url='' icon={faComments} setting={true} color='red' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2' >
                                <LinkContainer url='' icon={faEllipsisH} setting={true} color='' onChange={() => console.log('nice')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`row w-100 d-flex flex-justify-content-center ${classes.post}`}>
                    <div className='column col-12'>
                        <button className='btn btn-primary w-100' onClick={onClickHandler}>
                            Post
                            </button>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default CreatePost
