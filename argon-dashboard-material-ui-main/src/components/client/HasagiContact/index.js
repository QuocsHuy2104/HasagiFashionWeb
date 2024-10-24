import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import "components/client/assets/css/style.css";
import ArgonInput from 'components/ArgonInput';
import ArgonButton from 'components/ArgonButton';
const Contact = () => {
  return (
    <>
     <HasagiNav />
     <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Contact</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                    <li className="breadcrumb-item active text-white">Contact</li>
                </ol>
            </div>
    <div className="container-fluid contact py-5">
      <div className="container py-5">
        <div className="p-5 bg-light rounded">
          <div className="row g-4">
            <div className="col-12">
              <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
                <h1 className="text-primary">Get in touch</h1>
                <p className="mb-4">
                  The contact form is currently inactive. Get a functional and working contact form with React &amp; Spring boot in a few minutes. Just copy and paste the files, add a little code and you&apos;re done. 
                  <a href="https://htmlcodex.com/contact-form">Download Now</a>.
                </p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="h-100 rounded">
                <iframe
                  className="rounded w-100"
                  style={{ height: '400px' }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.904341867053!2d105.76483937480711!3d10.024752290081928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08945c836ec51%3A0x5c0b3d42b2ac9fdb!2sCHILL%20COFFEE!5e0!3m2!1sen!2s!4v1722940658661!5m2!1sen!2s"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-7">
              <form action="">
                <ArgonInput
                  type="text"
                  className="w-100 form-control border-0 py-3 mb-4"
                  placeholder="Your Name"
                />
                <ArgonInput
                  type="email"
                  className="w-100 form-control border-0 py-3 mb-4"
                  placeholder="Enter Your Email"
                />
                <textarea
                  className="w-100 form-control border-0 mb-4"
                  rows="5"
                  cols="10"
                  placeholder="Your Message"
                ></textarea>
                <ArgonButton
                  className="w-100 btn form-control border-secondary py-3 bg-white text-primary"
                  type="submit"
                >
                  Submit
                </ArgonButton>
              </form>
            </div>
            <div className="col-lg-5">
              <div className="d-flex p-4 rounded mb-4 bg-white">
               
                <div>
                  <h5 style={{ fontWeight: 'bold' }}> <FaMapMarkerAlt className="fa-2x text-primary me-1"/>Address:</h5>
                  <p style={{ fontSize: '1.5rem' }} className="mb-2">49 Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, VietNam</p>
                </div>
              </div>
              <div className="d-flex p-4 rounded mb-4 bg-white">
                
                <div> 
                <h5 style={{ fontWeight: 'bold' }}> <FaEnvelope className="fa-2x text-primary me-1"/>Mail Us:</h5>
                <p style={{ fontSize: '1.5rem' }} className="mb-2">hasagifashion@gmail.com</p>
                </div>
              </div>
              <div className="d-flex p-4 rounded bg-white">
               
                <div>
                <h5 style={{ fontWeight: 'bold' }}> <FaPhoneAlt className="fa-2x text-primary me-1"/>Telephone:</h5>
                <p style={{ fontSize: '1.5rem' }} className="mb-2">0398948675</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;
