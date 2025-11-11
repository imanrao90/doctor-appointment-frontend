import { useContext } from "react"
import { AppContext } from '../context/AppContext'
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function MyAppointmet() {
  const navigate = useNavigate()
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  function slotDateFormat(slotDate) {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  async function getUserAppointments() {
    try {
      const { data } = await axios.get(backendUrl + 'api/user/list-appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  async function cancelAppointment(appointmentId) {
    try {
      const { data } = await axios.post(backendUrl + 'api/user/cancel-appointment', { appointmentId },
        { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  function initPay(order) {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(backendUrl + 'api/user/verify-razorpay', response, { headers: { token } })

          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }

        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }

      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  async function appointmentRazorpay(appointmentId) {
    try {
      const { data } = await axios.post(backendUrl + 'api/user/payment-razorpay', { appointmentId }, { headers: { token } })

      if (data.success) {
        initPay(data.order)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b  border-gray-200">My Apppointments</p>
      <div>
        {
          appointments.slice(0, 2).map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-gray-200"
              key={index}
            >
              <div>
                <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {
                  !item.cancelled && item.payment && !item.isCompleted &&
                  <button
                    className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50"
                  >Paid</button>
                }

                {
                  !item.cancelled && !item.payment && !item.isCompleted &&
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:text-white duration-300 transition-all ">Pay Online</button>
                }

                {
                  !item.cancelled && !item.isCompleted &&
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-white duration-300 transition-all ">Cancel appointment</button>

                }

                {
                  item.cancelled && !item.isCompleted &&
                  <button
                    className="sm:min-w-48 py-2 border border-red-500"
                  >Appointment Cancelled</button>
                }

                {
                  item.isCompleted &&
                  <button
                    className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500"
                  >Completed</button>
                }

              </div>
            </div>
          ))
        }
      </div>
    </div >
  )
}

export default MyAppointmet
