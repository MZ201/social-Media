import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import classes from './style/linkContainer.module.css'
import { Dropdown } from 'react-bootstrap'


const LinkContainer = ({ url, icon, setting, color, onChange }) => {
    const [show, setShow] = useState(false)
    return (
        <Dropdown.Toggle className={`${classes.change} ${setting ? classes.button : classes.Button}`}
            onClick={onChange}>
            <Link href={`${url}`}>
                <div className='w-100'>
                    <FontAwesomeIcon icon={icon}
                       style={{ fontSize: setting ? '16px' : "22px" }}
                        color={`${color}`}
                    />
                    {!setting && show ? <span className={classes.span}></span> : null}
                </div>
            </Link>
        </Dropdown.Toggle>
    )
}

export default LinkContainer
