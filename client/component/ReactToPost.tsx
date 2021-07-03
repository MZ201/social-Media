

const ReactToPost = ({ LikeClass, emogi, color, expression , LikeHandler }) => {
    return (
        <div className={`column col-4 ${LikeClass} like`} onClick = {LikeHandler}>
            <div className='row h-100 w-100 m-0 p-0 d-flex justify-content-center'>
                <div className='column mr-2 d-flex align-items-end '>
                    {expression === 'Like' ?
                        <h5 style={{
                            fontSize: "20px",
                            color: "transparent",
                            textShadow: `0 0 0 ${color}`
                        }}>{emogi}</h5> :
                        <h5 style={{
                            fontSize: "20px",
                        }}>{emogi}</h5>
                    }
                </div>
                <div className='column d-flex align-items-center'>
                    <p className='m-0 p-0' style={{ color: color }}>{expression}</p>
                </div>
            </div>
        </div>
    )
}

export default ReactToPost
