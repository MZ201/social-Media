import React from 'react'

import { faImage, faMusic } from "@fortawesome/free-solid-svg-icons";
import LinkContainer from "./linkContainer";
import { Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './style/UiFileInputButton.module.css'

export interface IProps {
    acceptedFileTypes?: string;
    allowMultipleFiles?: boolean;
    label: string;
    onChange: (formData: FormData, fileInfo) => void;
    uploadFileName: string;
    for: string;
}

export const UiFileInputButton: React.FC<IProps> = (props) => {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const formRef = React.useRef<HTMLFormElement | null>(null);

    const onClickHandler = (e) => {
        e.preventDefault()
        fileInputRef.current?.click();
    };

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) {
            return;
        }
        const formData = new FormData();
        const fileInfo = Array.from(event.target.files).map((file) => {
            formData.append(event.target.name, file)
            return (event.target.name, file);
        });
        props.onChange(formData, fileInfo);

        formRef.current?.reset();
    };

    let UI

    switch (props.for) {
        case 'CREATE_POST':
            UI = <LinkContainer url='' icon={faImage} setting={true} color='green'
                onChange={onClickHandler} />
            break;
        case "CREATE_COMMENT":
            UI = (<div className={`${classes.commentUI}`}
                onClick = {onClickHandler}
            >
                <FontAwesomeIcon icon={faImage} color = 'black'
                    style={{
                        fontSize: '15px'
                    }}
                />
            </div>
            )
            break ; 
        case "CREATE_STATUS":
            UI =
                (<div className='d-flex align-items-center justify-content-center'
                    style={{
                        height: '30px',
                        width: '30px'

                    }}
                    onClick={onClickHandler}>
                    <Image src={'/image-gallery-svgrepo-com.svg'} style={{
                        height: "17px",
                        width: "17px",
                        transform: "rotate(180deg)",
                        position: 'absolute',
                        left: '25%',
                        top: "29%",
                        cursor: "pointer"
                    }} fluid
                    />
                </div>)
            break;
        case 'MUSIC':
            UI = (
                <div className={`row ${classes.musicAttach}`} onClick={onClickHandler}>
                    <div className="column justify-content-center offset-3">
                        <FontAwesomeIcon icon={faMusic}
                            style={{
                                fontSize: '20px',
                                marginRight: '3rem'
                            }}
                        />
                        <span>Music</span>
                    </div>
                </div>
            )
            break;
        default:
            throw new Error('something wrong')
    }
    return (
        <form ref={formRef}
            style={{ position: 'relative' }}
            className={props.for !== 'MUSIC' ? 'd-flex align-items-center justify-content-center'
                : ''
            }
        >

            {UI}

            <input
                accept={props.acceptedFileTypes}
                multiple={props.allowMultipleFiles}
                name={props.uploadFileName}
                onChange={onChangeHandler}
                ref={fileInputRef}
                style={{
                    display: 'none', height: "100%",
                    width: "100%", position: "absolute",
                    top: '0%', left: '0%'
                }}
                type="file"
            />
        </form>
    );
};