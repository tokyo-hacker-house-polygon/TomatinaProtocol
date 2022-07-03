import { useState, useEffect } from "react";
import { GET_DEFAULT_PROFILES, GET_DEFAULT_PROFILES_FROM_ADDRESS } from "./api/api"
import Image from 'next/image'
import { apolloClient } from '../apollo-client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

export default function Address() {
    const [profile, setProfile] = useState()
    const [formInput, updateFormInput] = useState("")

    async function profileFromAddr() {
        try {
            console.log(formInput)
            console.log(typeof(formInput))
            const response = await  apolloClient.query({
                query: gql(GET_DEFAULT_PROFILES),
                variables: {
                    request: 
                        { ethereumAddress: formInput}
                },
              })
            console.log(formInput)
            console.log("response", response)
            setProfile(response.data.defaultProfiles)
        } catch (err) {
            console.log("error fetching profile...", err)
        }
    }


    useEffect(() => {
        console.log(formInput)
    }, [formInput]);

    return (
        <div>
            <div>
                <input
                    placeholder = "To address"
                    className="mt-2 border rounded p-4"
                    value={formInput}
                    onChange={(e) => updateFormInput(e.target.value)}
                />
                <button
                    onClick={profileFromAddr}
                    className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"                   
                >
                    getDefaultProfile
                </button>
            </div>
            {/*
            {
                profile.picture ? (
                    <Image
                        width="100px"
                        height="200px"
                        src={profile.picture.original.url}
                    />
                ) : (
                    <div style={{ width: '200px', height: '200px', backgroundColor: 'black' }}/>
                )
            }
        
            <div>
                <h4>{profile.handle}</h4>
            </div>
            */}
        </div>
    )
}