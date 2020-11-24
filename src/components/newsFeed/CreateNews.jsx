import React, { useState } from 'react';
import headers from 'services/headers';
import videoChat from 'images/videoChat.png';
import addPhoto from 'images/addPhoto.png';
import defaultAvatar from 'images/defaultAvatar.png';
import axios from 'axios';

export default function CreateNews({ username, avatar, user_id, setPosts, socket }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState([]);

    const postCreate = async (e) => {
        e.preventDefault();
        const postData = {
            content,
            image,
            user_id,
        };
        try {
            const { data } = await axios.post('/api/posts/create', postData, {
                mode: 'cors',
                headers: headers(),
            });
            if (data.errors) {
                setErrors(data.errors);
                return;
            }
            setPosts((posts) => [data.post, ...posts]);
            socket.emit('new_post', data.post);
            setImage('');
            setContent('');
            setImagePreview('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFile = (e) => {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    return (
        <form className="create-post" onSubmit={(e) => postCreate(e)}>
            <div>
                <img src={avatar || defaultAvatar} alt="" className="profile-image" />
                <input
                    name="content"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`How are you today, ${username || ''}?`}
                    className="text-input"
                    value={content}
                    autoComplete="off"
                ></input>{' '}
            </div>

            <img src={imagePreview} alt="" className="image-preview" />

            <div>
                <label htmlFor="image" className="file-input">
                    <img src={videoChat} alt="" />
                    <p>Create Video<br />Chat Room</p>
                </label>

                <label htmlFor="image" className="file-input">
                    <img src={addPhoto} alt="" />
                    <p>Add An Image<br />Or Photo</p>
                    <input
                        type="file"
                        name="image"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => handleFile(e)}
                    />
                </label>
            </div>

            <ul className="errors">
                {errors.map((error) => (
                    <li key={error.msg}>{error.msg}</li>
                ))}
            </ul>
            <button>Post</button>
        </form>
    );
}
