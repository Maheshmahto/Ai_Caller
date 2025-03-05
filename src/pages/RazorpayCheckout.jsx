import  { useState, useEffect } from "react";
import axios from "../helper/axios";
import { ShoppingBag } from "lucide-react";
import Swal from "sweetalert2";

const RazorpayCheckout = () => {
  const [amount, setAmount] = useState(500);
  const [receipt, setReceipt] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [bgImage] = useState("");

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const userId = parsedUser?.user_id || "";

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (!document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadRazorpayScript();
  }, []);

  const createOrder = async () => {
    if (!userId || !amount || !receipt) {
      alert("Please enter all required fields.");
      return;
    }

    try {
      const response = await axios.post("/api/create_order/", {
        user_id: userId,
        amount,
        currency: "INR",
        receipt,
      }, {
        headers: {
          Authorization: `Bearer ${parsedUser?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        setOrderId(response.data.order_id);
        setOrderDetails(response.data.order_details);
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
      handler: async (response) => {
        Swal.fire({
          title: `Payment Successful! Payment ID: ${response.razorpay_payment_id}`,
          icon: "success",
        });

        try {
          if (!parsedUser?.token) {
            alert("Authentication required!");
            return;
          }

          await axios.post("/api/verify_payment/", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }, {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
      theme: { color: "#F37254" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gray-100 bg-opacity-50" />
      <div className="max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-6">
              <input
                type="number"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <input
                type="text"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Enter Receipt Name"
                value={receipt}
                onChange={(e) => setReceipt(e.target.value)}
              />

              <button
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckout;
