import loginpng from "../assets/login.png";
import SignupForm from "../components/SignupForm";
function Signup() {
  return (
    <section className="w-full h-screen flex">
      <SignupForm />
      <div className="w-full h-screen flex flex-row">
        <div className="w-[70%] bg-white flex  items-center">
          <div className="lg:w-[650px] md:w-[400px] h-auto object-cover pl-20">
            <img src={loginpng} className="w-[100%] h-[100%]" />
          </div>
        </div>
        <div className="w-[30%] bg-[#041b4d]"></div>
      </div>
    </section>
  );
}

export default Signup;
