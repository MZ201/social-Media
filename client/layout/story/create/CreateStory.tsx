import { useSelector } from 'react-redux'

import { State } from '../../../store'

import classes from './createStory.module.css'


const CreateStory = ({ }) => {
    const { content, img } = useSelector((state: State) => state.statusType)
    return (
        <div className={`${classes.container}`}>
            <span className={`${classes.preview}`}>Preview</span>
            <div className={`${classes.scope}`}>


                <div className={`${classes.imgClass}`}
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundOrigin:"content-box",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        borderRadius: "10px"
                    }}
                >
                    <i>
                        <span className={`${classes.span}`}>
                            {!content ? "Start Typing" : content}
                        </span>
                    </i>
                </div>

            </div>

        </div>
    )
}

export default CreateStory
