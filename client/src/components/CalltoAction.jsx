import React , {useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();
  const [isAuthenticated , setIsAuthenticated] = useState(false);
 
  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/verify", {
        credentials : 'include' ,
        headers: {
          'Content-Type': 'application/json'
        }
    });
      setIsAuthenticated(response.ok);
      
    } catch (error) {
      console.error("Error in checking authentication:", error);
      setIsAuthenticated(false);
      return false;
   } 
  };

  useEffect(() => {
      checkAuth();
     } , []);

  const handleCreateJournal = () => {
  
    if (isAuthenticated) {
      navigate('/journal-entry');
    } else {
      navigate('/signup');
    }
  };
  
  return (
  <section className="bg-custom-gradient py-16 text-white text-center">
    <div className="container mx-auto px-8">
      <div className="max-w-xl mx-auto mt-8">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="mb-8">
          Start chronicling your adventures and build a stunning collection of memories that you can cherish for a lifetime.
          So grab your e-journal and immerse yourself in the beauty of India while creating lasting memories.
        </p>
        <button className="bg-white text-[#2414d0d0] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all hover:-translate-y-1"
        onClick= {handleCreateJournal}>
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