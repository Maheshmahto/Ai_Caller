import { useState, useEffect } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { RiSecurePaymentLine } from "react-icons/ri";
import axios from "../helper/axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RechargePage = () => {
  const { isNightMode } = useNightMode();

  const [amount, setAmount] = useState(null);
  const [receipt, setReceipt] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const token = localStorage.getItem("token");

  const payloadBase64 = token.split(".")[1]; 
  const payloadDecoded = JSON.parse(atob(payloadBase64));
  const user_id = payloadDecoded.user_id;
  const location = useLocation();
 const navigate=useNavigate();
  useEffect(() => {
  
    if (location.state?.price) {
      setAmount(location.state.price);
    } else {
      const storedPrice = localStorage.getItem("rechargePrice");
      if (storedPrice) {
        setAmount(Number(storedPrice)); 
      }
    }
  }, [location.state]);
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (
        !document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();
  }, []);

  const createOrder = async () => {
    // console.log(amount);
    if (!user_id || !amount || !receipt) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/create_order/",
        { user_id: user_id, amount, currency: "INR", receipt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setOrderId(response.data.order_id);
        setOrderDetails(response.data.order_details);
        // console.log(response);
        return response.data.order_id;
      } else {
        throw new Error("Order creation failed");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      const createdOrderId = await createOrder();
      if (!createdOrderId) {
        alert("Failed to create order");
        return;
      }
      setOrderId(createdOrderId);
      return;
    }

    if (!orderDetails) return;

    const options = {
      key: "rzp_test_hqWvVqOn8QFGEF",
      amount: orderDetails.amount,
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: orderId,
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },

      handler: async function (paymentResponse) {
        try {
          if (!token) {
            alert("Authentication required!");
            return;
          }
          setAmount(null);
          setReceipt("");
          const verifyResponse = await axios.post(
            "/api/verify_payment/",
            {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (verifyResponse) {
            Swal.fire({
              title: `Payment Successful! Payment ID: ${paymentResponse.razorpay_payment_id}`,
              icon: "success",
            }).then(()=>{
              navigate('/dashboard')
            })
          }
          // console.log(verifyResponse);
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div
        className={`${
          isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
        } flex items-center justify-center min-h-screen bg-gray-100 inset-ring border-spacing-1`}
      >
        <div
          className={`${
            isNightMode
              ? "bg-customDarkGray text-white"
              : "bg-white text-gray-700"
          } shadow-2xl rounded-2xl p-6 w-96 text-center`}
        >
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-700">
              <div className="border-b mx-auto flex justify-center">
                <img src="./images/MAITRIAILOGO4.png" alt="Logo" />
              </div>
            </h1>
          </div>
          <div className="flex items-center justify-center mb-2">
            <span className="text-green-600 text-lg">
              <RiSecurePaymentLine />
            </span>
            <h2 className="text-gray-700 font-medium ml-2">Secure Checkout</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Your payment is protected by bank-level security
          </p>
          <div className="space-y-3">
            <input
              type="number"
              placeholder="Your Amount"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none 
              ${
                isNightMode
                  ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              required
              value={amount || ""} // Use empty string as fallback
              onChange={(e) => setAmount(Number(e.target.value))} // Allow changes
            />
            <input
              type="text"
              placeholder="Enter Receipt Name"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none 
      ${
        isNightMode
          ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
          : "bg-white text-gray-700 border-gray-300"
      }`}
              required
              onChange={(e) => setReceipt(e.target.value)}
            />
          </div>
          <button
            onClick={handlePayment}
            className="w-full bg-pink-500 text-white font-semibold py-2 mt-4 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
          >
            Pay Now
          </button>

          <div className="mt-4 flex justify-center items-center text-gray-500 text-sm">
            <span className="mr-2">Secured by</span>
            <div className="flex justify-around gap-2">
              <FaCcVisa size={25} />
              <FaCcMastercard size={25} />
              <SiAmericanexpress size={25} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RechargePage;
