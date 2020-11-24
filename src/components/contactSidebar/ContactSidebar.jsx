import React from 'react';

import ContactList from './ContactList';

export default function ContactSidebar({ currentUser, socket }) {
    return (
        <section className="contacts-chat">
            <h3>Contacts</h3>

            {currentUser.friends && currentUser.friends.map((friend) => (
                <ContactList
                    friend={friend}
                    key={friend._id}
                    socket={socket}
                    currentUserID={currentUser._id}
                />
            ))}
        </section>
    );
}
