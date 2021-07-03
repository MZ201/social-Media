import classes from "./style/Image.module.css"

const ImageContainer = ({ src }) => {
    return (
        <div className={`${classes.img}`} >
            <img src = {src}
                alt='image' className='img-fluid rounded-circle' />
        </div>
    )
}

export default ImageContainer
