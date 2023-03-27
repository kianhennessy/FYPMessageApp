import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import {ChatEngine, deleteMessage} from 'react-chat-engine'


import { useAuth } from "../contexts/AuthContext"

import { auth } from "../firebase"


export default function Chats() {
    const didMountRef = useRef(false)
    const [ loading, setLoading ] = useState(true)
    const { user } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true

            if (!user || user === null) {
                history.push("/")
                return
            }

            // Get-or-Create should be in a Firebase Function
            axios.get(
                'https://api.chatengine.io/users/me/',
                { headers: {
                        "project-id": '8afaea8d-1514-4b90-bc09-a5f244987db7',
                        "user-name": user.email,
                        "user-secret": user.uid
                    }}
            )

                .then(() => setLoading(false))

                .catch(e => {
                    let formdata = new FormData()
                    formdata.append('email', user.email)
                    formdata.append('username', user.email)
                    formdata.append('secret', user.uid)

                            axios.post(
                                'https://api.chatengine.io/users/',
                                formdata,
                                {headers: { "private-key": "69bf80d7-db82-427c-8830-1b78c5abdbd0"} }
                            )
                                .then(() => setLoading(false))
                                .catch(e => console.log('e', e.response))
                        })
                //})
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        }
    }, [user, history])


    if (!user || loading) return <div />

    return (
        <div className='chats-page'>
            <div className='nav-bar'>
                <div className='logo-tab'>
                    Message
                </div>

                <div onClick={handleLogout} className='logout-tab'>
                    Logout
                </div>
            </div>

            <ChatEngine
                height="calc(100vh - 66px)"
                projectID="8afaea8d-1514-4b90-bc09-a5f244987db7"
                userName={user.email}
                userSecret={user.uid}


                onDeleteMessage={() => {
                    setLoading(true);
                    setLoading(false);
                    }
                }
                onGetMessages={(chatId, messages) => {
                    console.log("Get Messages fired: ", messages);
                    const props = {publicKey: '8afaea8d-1514-4b90-bc09-a5f244987db7',
                        userName: user.email,
                        userSecret: user.uid}
                    messages.map((message) => {
                        // If message is more than 1 minute, delete it
                        const timeToGo = Math.max(0,6000000 - (new Date() - new Date(message.created)))
                        if(!message.deleting && message.id && (message.sender.username === user.email)) {
                            message.deleting = true
                            setTimeout(() => {
                                console.log("Deleting Message");
                                    deleteMessage(props, chatId, message.id, () => {
                                        console.log(message.id, "deleted");


                                        // Refresh chat feed
                                        setLoading(true);
                                        setLoading(false);
                                    })
                            }, timeToGo)
                        }
                    })
                }}
            />

        </div>
    )
}
