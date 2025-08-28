import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Alice Johnson',
      quote: 'This platform has revolutionized how I manage my crypto assets. The interface is intuitive and the features are robust!',
      rating: 5
    },
    {
      id: 2,
      name: 'Bob Smith',
      quote: 'I love the real-time price updates and the easy-to-use wallet connection. Highly recommended for any crypto enthusiast.',
      rating: 4
    },
    {
      id: 3,
      name: 'Charlie Brown',
      quote: 'A fantastic tool for tracking my portfolio and discovering new NFTs. The community features are a great bonus.',
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section">
      <h2 className="text-center my-4">What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <p className="testimonial-quote">"{testimonial.quote}"</p>
            <p className="testimonial-name">- {testimonial.name}</p>
            <div className="testimonial-rating">
              {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;