import React from 'react'; // For simple animation (below)

const ContactUs = () => {
  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 fade-in">
          <h2 className="text-center mb-4 fw-bold display-6">
            Contact <span className="text-primary">Us</span>
          </h2>
          <p className="text-center text-muted mb-5">
            Have questions, feedback, or just want to say hello? We'd love to hear from you!
          </p>

          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name" 
                placeholder="Enter your name" 
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter your email" 
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea 
                className="form-control" 
                id="message" 
                rows="5" 
                placeholder="Write your message here..." 
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary px-5 py-2">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
