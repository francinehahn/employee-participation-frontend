import styles from "./loadingButton.module.scss"

export function Loading({insideButton}) {
    let buttonStyle
    insideButton? buttonStyle = styles.button : buttonStyle = styles.container 
    
    return (
        <div className={buttonStyle}>
        </div>
    )
}