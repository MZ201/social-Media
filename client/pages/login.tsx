import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classes from '../styles/login.module.css'
import useRoute from 'next/router'
import { userLogin } from '../actions/userActions'
import { State } from '../store'

export async function getServerSideProps(ctx) {
    const cookie = ctx.req.headers.cookie ? ctx.req.headers.cookie : null

    return {
        props: {
            cookie
        }
    }
}


const login = ({ cookie }) => {
    const router = useRoute
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { error, userInfo } = useSelector((state: State) => state.userLogin)

    useEffect(() => {
        if (userInfo?.id) {
            router.push('/')
        }
    }, [cookie, router, userInfo])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(userLogin(email, password))
    }

    return (
        <>
            {userInfo?.id && (
                <div className={`container-fluid ${classes.container} d-flex justify-content-center align-items-center`} >
                    <div className="spinner-border m-5" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
            }

            {!userInfo?.id && (
                <div className={`container-fluid ${classes.container} d-flex justify-content-center align-items-center`}>
                    <div className={`card ${classes.card}`}>
                        <h5 className='card-title text-info text-center mt-3'>
                            Login
                    </h5>
                        <div className='card-body'>
                            <form onSubmit={onSubmitHandler}>
                                <div className="form-group">
                                    <label className="text-info">Email:</label>
                                    <input type="email" name="email" className="form-control"
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-info">Password:</label>
                                    <input type="password" name="password" className="form-control"
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group d-flex justify-content-between">
                                    <label className="text-info">
                                        <span>Remember me</span>
                                        <span>
                                            <input id="remember-me" name="remember-me" type="checkbox"
                                            />
                                        </span>
                                    </label>
                                    <input type="submit" name="submit" className="btn btn-info btn-md" value="submit"
                                    />
                                </div>
                                <div className="text-center">
                                    <a href="#" className="text-info">Register here</a>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>)
                }

        </>
    )
}




export default login