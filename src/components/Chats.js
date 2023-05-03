import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import {ChatEngine, deleteMessage, newChat, ChatFeed} from 'react-chat-engine'


import { useAuth } from "../contexts/AuthContext"

import { auth } from "../firebase"

import Button from "@mui/material/Button";
import navlogo from "../images/GREYsecurecomms128.png";

// Set API_KEY and API_SECRET from environment variables
const API_KEY = process.env.REACT_APP_CHATENGINE_API_KEY
const API_SECRET = process.env.REACT_APP_CHATENGINE_API_SECRET

// Define the Chats component
export default function Chats() {
    // Define state and ref variables
    const didMountRef = useRef(false)
    const [ loading, setLoading ] = useState(true)
    const { user } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        await auth.signOut()
        history.push("/")
    }


    // Create a new chat
    const createChat = () => {
        // Chat props
        // API key is the project ID from Chat Engine
        const props = {publicKey: API_KEY,
            // User name is the email address of the logged in user, from Firebase
            userName: user.email,
            // User secret is the Firebase UID
            userSecret: user.uid}
        const chat = newChat(props, {title: "New Chat"})
        console.log("Chat created: ", chat);
    }



    // Use useEffect to check if the user is logged in, fetch or create their Chat Engine user data
    useEffect(() => {
        // Initial mounting logic
        if (!didMountRef.current) {
            didMountRef.current = true
            // If user is not logged in, redirect to login page
            if (!user || user === null) {
                history.push("/")
                return
            }

            // Get user data from Chat Engine, or create new user if they don't exist
            axios.get(
                'https://api.chatengine.io/users/me/',
                { headers: {
                        "project-id": API_KEY,
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
                                {headers: { "private-key": API_SECRET} }
                            )
                                .then(() => setLoading(false))
                                .catch(e => console.log('e', e.response))
                        })
                //})

        }
    }, [user, history])

    // Loading or user not authenticated, return an empty div
    if (!user || loading) return <div />

    // Render the Chats component
    return (


        <div className='chats-page'>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>

                    <div className='nav-bar'>
                    <div className='logo-tab'>
                        SecureComms
                    </div>
                        <a href="/">
                            <img src={navlogo} alt="logo" className="logosize2"/>
                        </a>


                        <div onClick={handleLogout} className='logout-tab'>
                            Logout
                        </div>
                    </div>


            <ChatEngine

                // Render the Chat Feed
                renderChatFeed={(chat) => {
                    console.log("Chat Feed fired: ", chat);

                    // If chats exist, render the Chat Feed with the chats
                    if(chat.chats && Object.keys(chat.chats).length > 0) {
                        return <ChatFeed {...chat} />
                    }

                    // Render a button to create a new chat if no chats exist
                    return (
                        <Button
                            id="newChatButtonMobile"
                            variant="contained"
                            color="primary"
                            onClick={createChat}
                        >
                            New Chat
                        </Button>
                    )
                    }
                }


                // Chat Engine props
                // Define chat component height
                height="calc(100vh - 40px)"
                // API key is the project ID from Chat Engine
                projectID={API_KEY}
                // User name is the email address of the logged in user, from Firebase
                userName={user.email}
                // User secret is the Firebase UID
                userSecret={user.uid}


                // Refresh the chat feed when a chat is deleted
                onDeleteChat={(chat) => {
                    console.log("Delete Chat fired: ", chat);
                    setLoading(true);
                    setLoading(false);
                    }
                }

                // Refresh the chat feed when a message is deleted
                onDeleteMessage={() => {
                    setLoading(true);
                    setLoading(false);
                    }
                }


                onGetMessages={(chatId, messages) => {
                    console.log("Get Messages fired: ", messages);

                    // Define chat props for Chat Engine API calls
                    const props = {publicKey: API_KEY,
                        userName: user.email,
                        userSecret: user.uid}

                    // Iterate through the fetched messages
                    messages.map((message) => {

                        // Calculate the time remaining before the message should be deleted
                        // If message is more than 30 minutes old, delete it
                        const timeToGo = Math.max(0,60000 * 30 - (new Date() - new Date(message.created)))

                        // Check if the message is not already being deleted, has an ID, and was sent by the current user
                        if(!message.deleting && message.id && (message.sender.username === user.email)) {

                            // Set the message as being deleted
                            message.deleting = true

                            // Schedule a function to delete the message after the calculated time remaining
                            setTimeout(() => {
                                console.log("Deleting Message");

                                // Call the deleteMessage function to delete the message
                                deleteMessage(props, chatId, message.id, () => {
                                        console.log(message.id, "deleted");

                                        // Refresh the chat feed after deletion
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
