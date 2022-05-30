import React, {useCallback} from 'react'
import IconButtom from "@material-ui/core/IconButton"
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {makeStyles} from "@material-ui/styles"
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject} from "firebase/storage";
import ImagePreview from './imagePreview';
import {useDispatch} from "react-redux";
import {showLoadingAction, hideLoadingAction} from "../../reducks/loading/actions";

const useStyle = makeStyles({
    icon: {
        height: 48,
        width: 48
    }
})

const ImageArea = (props) => {
    const classes = useStyle();
    const dispatch = useDispatch();

    const deleteImage = useCallback((id) => {
        const ret = window.confirm('この画像を削除しますか？');
        if (!ret) {
            return false
        } else {
            const newImages = props.images.filter(image => image.id !== id);
            props.setImages(newImages);
            const storage = getStorage();
            const desertRef = ref(storage, 'images/'+id);
            return deleteObject(desertRef).then(() => {
                // File deleted successfully
                console.log('delete true');
              }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log('delete false');
              });
            //return //storage.ref('images').child(id).delete()
        }

    },[props.images])

    const uploadImage = useCallback((event) => {
        const file = event.target.files;
        let blob = new Blob(file, {type: "image/jpeg"});

        // Generate random 16 digits strings
        const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N=16;
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n%S.length]).join('')
        const storage = getStorage();
        const uploadRef = ref(storage, 'images/'+fileName);
        const uploadTask = uploadBytesResumable(uploadRef, blob);

        uploadTask.then(() => {
            // Handle successful uploads on complete
        
            getDownloadURL(uploadRef).then((downloadURL) => {
                const newImage = {id: fileName, path: downloadURL};
                props.setImages((prevState => [...prevState, newImage]))
                dispatch(hideLoadingAction())
            });
        }).catch((error) => {
            console.log(error);
        });
    }, [props.setImages])

    return (
        <div>
            <div className='p-grid__list-images'>
                {props.images.length > 0 && (
                    props.images.map(image =><ImagePreview delete={deleteImage} id={image.id} path={image.path} key={image.id}/>)
                )}
            </div>
            <div className='u-text-right'>
                <span>商品画像を登録する</span>
                <IconButtom className={classes.icon}>
                    <label>
                        <AddPhotoAlternateIcon />
                        <input 
                            className="u-display-none" type="file" id="image" 
                            onChange={(event) =>uploadImage(event)}
                        />
                    </label>
                </IconButtom>
            </div>
        </div>
    )
}

export default ImageArea