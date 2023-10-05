import React from "react";
import { useParams } from "react-router-dom";

export default function Home() {
    const { userId } = useParams();

    return (
        <div className="home">
            <h1>Welcome to the Home Page</h1>
            <p>You are logged in as user with ID: {userId}</p>
        </div>
    );
}
