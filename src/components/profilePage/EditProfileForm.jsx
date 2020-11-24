import React, { useState } from 'react';
import headers from 'services/headers';
import axios from 'axios';

export default function EditProfileForm({
    showEditForm,
    image,
    cover,
    userBio,
    userFirstName,
    userLastName,
    handleClick,
    currentUser,
}) {
    const [avatar, setAvatar] = useState(image);
    const [cover_photo, setCover_photo] = useState(cover);
    const [bio, setBio] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
    const [errors, setErrors] = useState([]);
    const [btnText, setBtnText] = useState('Update your profile');

    const updateProfile = async (e) => {
        e.preventDefault();
        setBtnText('Waiting...');
        try {
            const userData = {
                avatar: avatar || image,
                cover_photo: cover_photo || cover,
                bio: bio || userBio,
                first_name: first_name || userFirstName,
                last_name: last_name || userLastName,
            };
            const { data, status } = await axios.put(
                `/api/users/${currentUser}/profile`, userData,
                { mode: 'cors', headers: headers() }
            );
            setBtnText(data.message);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            if (status === 400) {
                setErrors(data);
                window.scrollTo(0, 0);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFile = (e, setPic, setPreview) => {
        setPreview(URL.createObjectURL(e.target.files[0]));
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setPic(reader.result);
        };
    };

    return (
        <>
            <form
                className={showEditForm ? 'edit-form active' : 'edit-form'}
                onSubmit={(e) => updateProfile(e)}
                encType="multipart/form-data"
            >
                {errors.length > 0 && (
                    <ul className="errors">
                        {errors.map((error) => (
                            <li key={error.msg}>{error.msg}</li>
                        ))}
                    </ul>
                )}

                <h2>
                    Edit Profile
                    <button type="button" onClick={handleClick}>X</button>
                </h2>

                <div>
                    <div>
                        <h3>Profile Picture</h3>
                        <label>Edit
                            <input
                                type="file"
                                name="avatar"
                                onChange={(e) => handleFile(e, setAvatar, setImagePreview)}
                            />
                        </label>
                    </div>

                    <div>
                        <img
                            src={imagePreview || image}
                            alt=""
                            className="profile-picture-preview"
                        />
                    </div>
                </div>
                <div>
                    <div>
                        <h3>Cover Photo</h3>
                        <label>Edit
                            <input
                                type="file"
                                name="cover_photo"
                                onChange={(e) => handleFile(e, setCover_photo, setCoverPhotoPreview)}
                            />
                        </label>
                    </div>

                    <div>
                        <img
                            src={coverPhotoPreview || cover}
                            alt=""
                            className="cover-photo-preview"
                        />
                    </div>
                </div>

                <div>
                    <h3 htmlFor="first_name">First Name</h3>
                    <input
                        type="text"
                        name="first_name"
                        required
                        defaultValue={userFirstName}
                        onChange={(e) => setFirst_name(e.target.value)}
                    />
                </div>

                <div>
                    <h3 htmlFor="last_name">Last Name</h3>
                    <input
                        type="text"
                        name="last_name"
                        required
                        defaultValue={userLastName}
                        onChange={(e) => setLast_name(e.target.value)}
                    />
                </div>

                <div>
                    <h3 htmlFor="bio">Bio</h3>
                    <textarea
                        name="bio"
                        cols="40"
                        rows="5"
                        defaultValue={userBio}
                        maxLength="101"
                        onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                </div>

                <button>{btnText}</button>
            </form>
        </>
    );
}
