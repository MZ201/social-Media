import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import classes from './style/linkContainer.module.css'
import { Dropdown } from 'react-bootstrap'

const LinkDropdown = ({ url, icon, setting, color }) => {
    const [show, setShow] = useState(false)
    return (
        <Dropdown>
            <Dropdown.Toggle className={`${classes.change} ${setting ? classes.button : classes.Button}`} 
             >
                    <Link href={`${url}`}>
                    <div className='w-100 d-flex align-items-center justify-content-center'>
                        <FontAwesomeIcon icon={icon}  color={`${color}`}
                            style = {{
                                fontSize : "20px"
                            }}
                        />
                        {!setting && show ? <span className={classes.span}></span> : null}
                    </div>
                </Link>
            </Dropdown.Toggle>
            <Dropdown.Menu className  = {`${classes.DropdownMenu}`}>
                <Dropdown.Item className = {`${classes.DropdownItem}`} href="#/action-1">delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown >
    )
}

export default LinkDropdown

