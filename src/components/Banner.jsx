import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"

function Banner() {
  const navigate = useNavigate()

  return (
    <div className="flex bg-blue-600 rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* LEFT SIDE */}

      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">

        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white font-semibold">
          <p>Book Appointment</p>
          <p className="mt-4 mb-6">With 100+ Trusted Doctors</p>
        </div>

        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0) }}
          className="bg-white px-8 py-3 rounded-full mt-6 text-gray-600 md:m-0 hover:scale-105 transition-all duration-300">
          Create Account
        </button>

      </div>

      {/* RIGHT SIDE */}

      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img className="w-full absolute right-0 max-w-md md:absolute bottom-0 h-auto rounded-lg" src={assets.appointment_img} alt="" />
      </div>
    </div>
  )
}

export default Banner
