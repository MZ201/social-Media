import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import classes from '../styles/login.module.css'
import useRoute from 'next/router'
import { userRegister } from '../actions/userActions'
import { State } from '../store'


const register = () => {
    const router = useRoute
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState([{ message: '', field: '' }])

    const { userInfo, loading, error } = useSelector((state: State) => state.userLogin)

    useEffect(() => {
        if (userInfo?.id > 0) {
            router.push('/')
        }
    }, [router, userInfo?.id])

    const onSubmitHandler = (e) => {
        e.preventDefault()
        dispatch(userRegister(name , email, password , phoneNumber))
    }

    return (
        <>
            <div className={`container-fluid ${classes.container} d-flex justify-content-center align-items-center`}>
                <div className={`card ${classes.card}`}>
                    <h5 className='card-title text-info text-center mt-3'>
                        Register
                </h5>
                    <div className='card-body'>
                        <form onSubmit={onSubmitHandler}>
                            <div className="form-group">
                                <label className="text-info">Name:</label>
                                <input type="text" name="name" className="form-control"
                                    value={name} onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                {message.filter(msg => msg.field === 'email')[0] &&
                                    <p>{message.filter(msg => msg.field === 'email')[0].message}</p>
                                }

                                <label className="text-info">Email:</label>
                                <input type="email" name="email" className="form-control"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                {message.filter(msg => msg.field === 'password')[0] &&
                                    <p>{message.filter(msg => msg.field === 'password')[0].message}</p>
                                }
                                <label className="text-info">Password:</label>
                                <input type="password" name="password" className="form-control"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-info">Confirm Password:</label>
                                <input type="password" name="password" className="form-control"
                                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-info">Phone Number:</label>
                                <input type="text" name="phoneNumber" className="form-control"
                                    value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="form-group d-flex justify-content-between">
                                <label className="text-info"></label>
                                <input type="submit" name="submit" className="btn btn-info btn-md" value="submit"
                                />
                            </div>
                            <i>Have already an Account : </i>
                            <div className="text-center">
                                <a href="#" className="text-info">Login</a>
                            </div>
                        </form>
                    </div>

                </div>

            </div>)
        </>
    )
}

export default register