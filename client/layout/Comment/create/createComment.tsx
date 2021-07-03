import { faCamera, faCameraRetro, faComment, faCommentAlt, faGift, faSmile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { countCommentOfPost, createCommentAction } from "../../../actions/commentActions"
import { State } from "../../../store"

import { UiFileInputButton } from "../../../component/UiFileInputButton"

import { Image } from "react-bootstrap"

import classes from './createComment.module.css'
import axios from "axios"
import { AUGMENTE_SKIP_GET_COMMENT, GET_COMMENT_RESET } from "../../../constants/commentConstants"



const CreateComment = ({ postID, InitialValue, replyComment, refComment }) => {

    const [value, setValue] = useState(InitialValue)
    const [image, setImage] = useState(null)
    const dispatch = useDispatch()


    const { success } = useSelector((state: State) => state.createComment)


    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const submitRef = React.useRef<HTMLInputElement | null>(null);
    const tagSpan = React.useRef<HTMLSpanElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);


    useEffect(() => {

        // send A comment to backend by Click enter
        textAreaRef.current.addEventListener('keyup', function (event: KeyboardEvent) {
            if (event.key === 'Enter') {
                submitRef.current.click()
            }
        })

        containerRef.current.setAttribute("style", "height:" + (textAreaRef.current.value === '' ? '32px'
            : textAreaRef.current.scrollHeight + 'px') + ";overflow:hidden;")


        textAreaRef.current.addEventListener("input", OnInput, false)

        textAreaRef.current.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key === 'Backspace' && textAreaRef.current.value ===
                InitialValue.substring(0, InitialValue.length - 1)) {
                tagSpan.current.innerHTML = ''
                textAreaRef.current.value = '';
            }

            // if (textAreaRef.current.value === '') {
            //   tagSpan.current.innerHTML = ''
            // }
        })


        function OnInput() {
            containerRef.current.style.height = textAreaRef.current.value === '' ? '32px' :
                this.scrollHeight + "px";

        }

    }, [success])


    // Create a new Comment 
    const formHandler = (event) => {
        event.preventDefault();

        if (!value) {
            return;
        }
        dispatch({
            type: AUGMENTE_SKIP_GET_COMMENT,
            payload: -1
        })

        dispatch({
            type: GET_COMMENT_RESET,
            postID: postID
        })


        dispatch(createCommentAction(postID, { content: value, img: image }, refComment))

        setValue('')

        setImage(null)
    }

    const onChange = async (formData, fileInfo) => {
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };

        try {
            await axios.post('/api/upload', formData, config);

            setImage(`/upload/${fileInfo[0].name}`)
        } catch (err) {
            console.log(err)
        }
    };

    const tagHandler = () => {
        tagSpan.current.setAttribute("style", "background-color : blue")
    }

    return (
        <>
            <div className='row p-0 m-0 mt-2 mb-3 '
                style={{
                    width: '96%',
                }}
                ref={containerRef}
            >
                <div className={`column ${replyComment ? 'offset-1' : ''} col-2 d-flex align-items-center justify-content-center`}>
                    <Image src='/StatusImage/nature1.jpeg' roundedCircle
                        width='32px' height='32px' />
                </div>
                <div className={`column col-8 h-100 m-0 p-0`}
                    style={{ backgroundColor: '#3a3b3c', borderRadius: '15px' }}>
                    <div className='row w-100 h-100 m-0 p-0 position-relative'>
                        <div className="column col-12 d-flex h-100 justify-content-center align-items-center"

                        >
                            <form className='comment position-relative w-100'
                                style={{
                                    height: '95%'
                                }}

                                onSubmit={formHandler}

                            >
                                <textarea
                                    placeholder={InitialValue === '' ? 'write a comment' : ''}
                                    ref={textAreaRef}
                                    value={value}
                                    style={{
                                        overflow: 'hidden',
                                    }}
                                    className='txta sendComment w-100'
                                    onChange={e =>
                                        setValue(e.target.value)
                                    } />

                                {InitialValue !== '' &&
                                    <span
                                        onClick={tagHandler}
                                        ref={tagSpan}
                                        className={`${classes.tags}`}>
                                        {InitialValue}
                                    </span>
                                }
                                <input ref={submitRef} type="submit" value="Submit" style={{
                                    display: 'none'
                                }} />

                            </form>
                        </div>
                        <div className={`${classes.attach}`}>
                            <div className=' h-100 d-flex align-items-center'>
                                <div className='d-inline'
                                >
                                    <UiFileInputButton
                                        acceptedFileTypes="image/*"
                                        label="Upload Single File"
                                        uploadFileName="theFiles"
                                        for="CREATE_COMMENT"
                                        onChange={onChange}

                                    />
                                </div>
                                <div className='d-flex align-items-center justify-content-center ml-2' style={{
                                    height: "25px",
                                    width: '25px',
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    backgroundColor: 'rgba(255, 255,255, 0.2)'
                                }}>
                                    <FontAwesomeIcon icon={faSmile}
                                        color='##6c757d'
                                        style={{
                                            fontSize: '15px',
                                        }
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {image && <div className={`row`}
                style={{
                    maxWidth: "80%"
                }}
            >
                <div className={`column ${replyComment ? 'offset-6' : 'offset-3'} h-100`}>
                    <Image src={image} fluid
                    />
                </div>
            </div>}
        </>
    )
}

export default CreateComment
