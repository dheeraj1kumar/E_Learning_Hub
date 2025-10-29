import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Certificate.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from './logo.png';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './NotFound';
// import signature from './signature.png'; // Assuming you have a signature image

const Certificate = () => {
    const { courseId } = useParams();
    const [loader, setLoader] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [showCertificate, setShowCertificate] = useState(false);
    const [user, setUser] = useState('NA');
    const [course, setCourse] = useState('NA');

    const checkValid = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/certificate/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response || !response.data || !response.data.success || !response.data.username) setIsValid(false);
            setUser(response.data.username);
            setCourse(response.data.coursename);
        } catch (error) {
            if (error.response) {
                setIsValid(false);
                toast.error(error.response.data.message);
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCertificate(isValid);
        }, 1000);

        checkValid();

        return () => clearTimeout(timer);
    }, []);

    const downloadPDF = () => {
        const capture = document.querySelector('.actual-receipt');
        setLoader(true);
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const componentWidth = doc.internal.pageSize.getWidth();
            const componentHeight = doc.internal.pageSize.getHeight();
            doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
            setLoader(false);
            doc.save('Certificate.pdf');
            toast.success("Certificate Downloaded");
        });
    };

    if (!isValid) return <NotFound />;
    if (!showCertificate) return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="spinner-border" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );

    return (
        <>
            <div className="certificate-body-container">
                <div className="certificate-body actual-receipt">
                    <div className="certificate-border">
                        <div className="certificate-header">
                            <img src={logo} alt="E-Learning Hub Logo" className="certificate-logo" />
                            <h1 className="certificate-title">E-Learning Hub</h1>
                        </div>
                        <div className="certificate-content">
                            <h2 className="certificate-marquee">Certificate of Completion</h2>
                            <p className="certificate-assignment">This certificate is presented to</p>
                            <h3 className="certificate-person">{user}</h3>
                            <p className="certificate-reason">for successfully completing the <span className='fw-bold'>{course}</span> Course</p>
                        </div>
                        <div className="certificate-signature">
                            {/* <img src={signature} alt="Signature" className="certificate-signature-img" /> */}
                            <p className="certificate-signature-text">Institute Admin</p>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center'>
                    <button
                        className="btn btn-success"
                        onClick={downloadPDF}
                        disabled={loader}
                    >
                        {loader ? "Downloading.." : "Download"}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default Certificate;
