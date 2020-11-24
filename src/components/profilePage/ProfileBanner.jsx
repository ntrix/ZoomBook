import React, { useState } from 'react';
import EditProfileForm from './EditProfileForm';
import defaultAvatar from 'images/defaultAvatar.png';
import editIcon from 'images/edit.png';
import AddFriendBtn from 'components/common/AddFriendBtn';

const defaultCover = 'https://res.cloudinary.com/dctcnhecv/image/upload/v1605436933/midb2bmtahameqrsea36.jpg';

export default function ProfileBanner({
    first_name,
    last_name,
    bio,
    cover_photo,
    avatar,
    notLoggedInUser,
    currentUser,
    friends,
    friend_requests,
}) {
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const switchFormState = () => {
        setShowEditProfileForm(!showEditProfileForm);
    };

    return (
        <section className="intro">
            <div className="user-images">
                <div className="cover-photo-container">
                    <img src={cover_photo? cover_photo: defaultCover} alt="" className="cover-photo" />
                </div>

                <img src={avatar || defaultAvatar} alt="" className="profile-picture" />
            </div>

            <article>
                <h1>{`${first_name} ${last_name}`}</h1>

                <p><strong>Bio: </strong>{bio}</p>

                <AddFriendBtn
                    notLoggedInUser={notLoggedInUser}
                    currentUser={currentUser}
                    friends={friends}
                    friend_requests={friend_requests}
                />

                {notLoggedInUser === currentUser && (
                    <>
                        <button type="button" onClick={switchFormState}>
                            <img src={editIcon} alt="" />
                            <p>Edit profile</p>
                        </button>

                        <EditProfileForm
                            showEditForm={showEditProfileForm}
                            handleClick={switchFormState}
                            userBio={bio}
                            image={avatar}
                            cover={cover_photo? cover_photo: defaultCover}
                            userFirstName={first_name}
                            userLastName={last_name}
                            currentUser={currentUser}
                        />
                    </>
                )}
            </article>
        </section>
    );
}
