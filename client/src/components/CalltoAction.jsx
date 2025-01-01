import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();
  return (
  <section className="bg-gradient-to-b from-[#A9C9FF] to-[#FFBBEC] py-16 text-white text-center">
    <div className="container mx-auto px-8">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="mb-8">
          Start chronicling your adventures and build a stunning collection of memories that you can cherish for a lifetime.
          So grab your e-journal and immerse yourself in the beauty of India while creating lasting memories.
        </p>
        <button className="bg-white text-[#2414d0d0] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all hover:-translate-y-1"
        onClick={() => navigate('/journal-entry')}>
          Create Your Journal
        </button>
        <div className="mt-8 relative h-12 overflow-hidden">
          <p className="absolute w-full animate-marquee">
            © Kabeer-Khosla 2024 .pvt ltd
            /pvt</p>
        </div>
        </div>
      </div>
    </section>
  );
};


export default CallToAction;