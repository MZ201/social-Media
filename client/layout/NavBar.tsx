import React from 'react'
import LinkContainer from '../component/linkContainer'
import classes from './style/NavBar.module.css'
import { faFacebook, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'
import {
    faBell, faChevronCircleDown, faGamepad, faHome, faPlus,
    faStore, faTv, faUserFriends
} from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { State } from '../store'

const NavBar = () => {
    const { userInfo, loading, error } = useSelector((state: State) => state.userLogin)
    return (
            <div className = {`${classes.fixed}`}>
                <div className={`row ${classes.navBar}`}>
                    <div className='column col-2'>
                        <div className='row'>
                            <div className='column'>
                                <LinkContainer url='/login' icon={faFacebook} setting={true} color=''
                                    onChange={() => console.log('nice')} />
                            </div>
                        </div>
                    </div>
                    <div className = 'column col-1'></div>
                    <div className='column col-6'>
                        <div className='row w-100 h-100'>
                            <div className='column col-2 h-100 position-relative'>
                                <LinkContainer url='/' icon={faHome} setting={false}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2 h-100' >
                                <LinkContainer url='/watch' icon={faTv} setting={false}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2 h-100'>
                                <LinkContainer url='/store' icon={faStore} setting={false}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2 h-100'>
                                <LinkContainer url='/groups' icon={faUserFriends} setting={false}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2 h-100'>
                                <LinkContainer url='game' icon={faGamepad} setting={false}
                                    color='rgba(228, 230, 235,0.8)' onChange={() => console.log('nice')} />
                            </div>

                        </div>
                    </div>
                    <div className='column col-3'>
                        <div className='row w-100 h-100 position-relative'>
                            <div className='column col-2 offset-4'>
                                <LinkContainer url='#' icon={faPlus} setting={true}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2'>
                                <LinkContainer url='#' icon={faFacebookMessenger} setting={true}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>
                            <div className='column col-2'>
                                <LinkContainer url='#' icon={faBell} setting={true}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>

                            <div className='column col-2'>
                                <LinkContainer url='#' icon={faChevronCircleDown} setting={true}
                                    color='rgba(228 , 230 , 235 , 0.8)' onChange={() => console.log('nice')} />
                            </div>

                        </div>

                    </div>

                </div >
            </div>
    )
}

export default NavBar
