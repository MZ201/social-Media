import React, { useEffect, useState } from 'react'
import StoryImages from '../../../component/StoryImages'
import classes from './StoryParametre.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { setStatusAudio, setStatusCentent, setStatusImage } from '../../../actions/statusSyncAction'
import { State } from '../../../store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { UiFileInputButton } from '../../../component/UiFileInputButton'
import axios from 'axios'



const StoryParametre = () => {
    const { content, img } = useSelector((state: State) => state.statusType)

    const [click, setClick] = useState(false)

    const formRef = React.useRef<HTMLTextAreaElement | null>(null)
    const spanRef = React.useRef<HTMLElement | null>(null)

    const dispatch = useDispatch()


    const onChange = async (formData, fileInfo) => {
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };

        try {
            const { data } = await axios.post('/api/upload', formData, config);


            dispatch(setStatusAudio(`/upload/${fileInfo[0].name}`))
        } catch (err) {
            console.log(err)
        }
    };


    useEffect(() => {

    })

    return (
        <>
            <div className={`row ${classes.container}`}>
                <span ref={spanRef}
                    className={
                        !click ? `${classes.unFocus}`
                            : `${classes.Focus}`}>
                    Start typing
                </span>
                <textarea
                    ref={formRef}
                    value={content}
                    className={`txta ${classes.text}`}
                    onChange={(e) => {
                        dispatch(setStatusCentent(e.target.value))
                    }}
                    onClick={() => {
                        formRef.current.placeholder = 'Start typing'
                        spanRef.current.innerHTML = 'Text'
                        setClick(true)
                    }}
                />
            </div>

            <UiFileInputButton
                label="Upload Single File"
                uploadFileName="theFiles"
                for="MUSIC"
                onChange={onChange}

            />
            {img?.startsWith('/StatusImage/') && <StoryImages />}

        </>
    )
}

export default StoryParametre
