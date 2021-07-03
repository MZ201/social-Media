import { useDispatch } from 'react-redux'
import { Image } from 'react-bootstrap'
import classes from './chooseStatus.module.css'
import { chooseStatus, setStatusImage } from '../../../actions/statusSyncAction'

import { UiFileInputButton } from '../../../component/UiFileInputButton'
import { useState } from 'react'
import axios from 'axios'

export enum chooseType {
    Image = 'Image',
    Text = 'Text'
}

const ChooseStatus = () => {
    const dispatch = useDispatch()

    const onChange = async (formData, fileInfo) => {
        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };

        try {
            const { data } = await axios.post('/api/upload', formData, config);

            // dispatch an action of status Image
            dispatch(setStatusImage(`/upload/${fileInfo[0].name}`))
        } catch (err) {
            console.log(err)
        }
    };


    return (
        <div className='row d-flex align-items-center justify-content-center'
            style={{ height: "calc(100vh - 25px)" }}>
            <div className={`${classes.story} ${classes.image}`}>
                <div className={`${classes.imgIcon}`}
                    onClick={() => dispatch(
                        chooseStatus(chooseType.Image)
                    )}
                >
                    <UiFileInputButton
                        label="Upload Single File"
                        uploadFileName="theFiles"
                        for="CREATE_STATUS"
                        onChange={onChange}
                    />
                </div>
                <span className={`${classes.comment}`}>create a Photo story</span>
            </div>
            <div className={`${classes.story} ${classes.text}`}
                onClick={() => {
                    dispatch(chooseStatus(chooseType.Text))
                    dispatch(setStatusImage('/StatusImage/image1.png'))
                }}
            >
                <div className={`${classes.imgIcon}`}>
                    <span className={`${classes.letter}`}>Aa</span>
                </div>
                <span className={`${classes.comment}`}>create a text story</span>
            </div>
        </div>
    )
}

export default ChooseStatus



