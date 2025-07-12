import React from 'react';

const About = () => {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        
        {/* Text Section */}
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="display-5 fw-bold mb-4">
            About <span className="text-primary">Us</span>
          </h2>
          <p className="lead text-muted mb-4">
            At <strong>Brand Store</strong>, we believe fashion is the ultimate expression of individuality.
            We craft stylish, comfortable clothing to help you stand out and feel your best.
          </p>
          <p className="text-muted">
            Since 2025, our commitment has been to quality, sustainability, and innovation — bringing you
            collections that are both timeless and trendsetting.
          </p>
          <a href="/shop" className="btn btn-primary btn-lg mt-4">
            Shop Now
          </a>
        </div>

        {/* Image Section */}
        <div className="col-lg-6">
          <div className="position-relative overflow-hidden rounded-4 shadow" style={{ animation: 'fadeIn 1s ease-in-out' }}>
            <img 
              src="https://img.freepik.com/free-vector/teamwork-concept-landing-page_52683-20165.jpg?semt=ais_country_boost&w=740" 
              alt="About Us" 
              className="img-fluid w-100 h-100 object-fit-cover"
            />
            <div 
              className="position-absolute top-0 start-0 translate-middle p-3 bg-primary rounded-circle opacity-25"
              style={{ width: '100px', height: '100px' }}
            ></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
