import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import HasagiNav from "components/client/HasagiHeader";
import Footer from "components/client/HasagiFooter";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://formsubmit.co/letuankiet140804@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Liên hệ đã được gửi thành công!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể gửi liên hệ.");
    }
  };
  return (
    <>
      <HasagiNav />
      <div
        className="container-fluid"
        style={{
          padding: "3rem 1rem",
          backgroundColor: "#f7f7f7",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="row g-4">
            <div className="col-12 mb-4">
              <iframe
                className="rounded w-100"
                style={{
                  height: "500px",
                  border: "none",
                  borderRadius: "12px",
                }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.904341867053!2d105.76483937480711!3d10.024752290081928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08945c836ec51%3A0x5c0b3d42b2ac9fdb!2sCHILL%20COFFEE!5e0!3m2!1sen!2s!4v1722940658661!5m2!1sen!2s"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  padding: "2rem",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    color: "#333",
                  }}
                >
                  Liên hệ với chúng tôi
                </h3>
                <ArgonInput
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    fontSize: "1.1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                <ArgonInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required

                  style={{
                    fontSize: "1.1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                />
                <textarea
                  name="message"
                  placeholder="Nội dung"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  style={{
                    width: "100%",
                    fontSize: "1.1rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                ></textarea>
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_subject" value="Liên hệ từ khách hàng Hasagi Fashion" />
                <input type="hidden" name="_next" value="https://yourwebsite.com/thank-you" />
                <input type="hidden" name="_template" value="table" />
                <ArgonButton
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: "#ff5722",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e64a19")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#ff5722")
                  }
                >
                  Gửi liên hệ
                </ArgonButton>
              </form>
            </div>

            <div className="col-lg-5">
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <FaMapMarkerAlt style={{ fontSize: "2rem", color: "#ff5722", marginRight: "1rem" }} />
                  <div>
                    <h5 style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>Địa chỉ:</h5>
                    <p style={{ margin: 0 }}>49 Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, VietNam</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <FaEnvelope style={{ fontSize: "2rem", color: "#ff5722", marginRight: "1rem" }} />
                  <div>
                    <h5 style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>Email:</h5>
                    <p style={{ margin: 0 }}>hasagifashion@gmail.com</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <FaPhoneAlt style={{ fontSize: "2rem", color: "#ff5722", marginRight: "1rem" }} />
                  <div>
                    <h5 style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>Số điện thoại:</h5>
                    <p style={{ margin: 0 }}>0398948675</p>
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
