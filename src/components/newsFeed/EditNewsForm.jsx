import React, { useState } from 'react';
import headers from '../../services/headers';
import axios from 'axios';

export default function EditNewsForm({
    oldContent,
    showEditForm,
    setShowEditForm,
    post_id,
    setPostContent,
}) {
    const [content, setContent] = useState(oldContent || '');
    const editPost = async (e) => {
        e.preventDefault();
        try {
            const { status } = await axios.put(`/api/posts/${post_id}`, content, {
                mode: 'cors',
                headers: headers(),
            });
            if (status === 200) {
                setShowEditForm(!showEditForm);
                setPostContent(content);
            }
        } catch (err) {
            console.error(err);
        }
    };
    if (showEditForm) {
        return (
            <form className="post-edit-form" onSubmit={(e) => editPost(e)}>
                <input
                    type="text"
                    value={content}
                    required
                    onChange={(e) => setContent(e.target.value)}
                />

                <button>Edit Post</button>
            </form>
        );
    }
    return <></>;
}
