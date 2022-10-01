import React from "react";
import "./spinner.css";
import Container from "react-bootstrap/Container";

export default function Spinner({ text }) {
    return (
        <Container className='d-flex flex-column align-items-center justify-content-center p-5'>
            <div className="spinner-container">
                <div className="loading-spinner">
                </div>
            </div>
            {text}
        </Container>
    );
}