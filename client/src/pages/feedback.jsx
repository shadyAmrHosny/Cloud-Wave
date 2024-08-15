import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";
import SignOut from "../components/SignOut";
import Cont from "./Cont";
import StarRating from "../components/starrating";

export default function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here, e.g., send data to the server

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 4000);

    setRating(0);
    setComment("");
    event.target.reset();
  };

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="flex w-screen h-screen text-white bg-[#041b4d]">
      {showPopup && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded shadow-lg text-lg">
          Submitted Successfully
        </div>
      )}
      <div className="flex flex-col w-[220px] border-r border-gray-800">
        <Cont />
      </div>
      <div className="flex flex-col min-h-screen flex-grow bg-white text-black">
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-8 border-b border-gray-500">
          <h1 className="text-2xl font-bold text-[#041b4d] opacity-90">
            HomePage
          </h1>
          <button className="relative flex flex-row gap-2 text-center right-24 items-center text-sm focus:outline-none group">
            <div className="text-lg font-semibold text-[#041b4d] opacity-90">
              MY Account
            </div>
            <div className="flex w-8 h-8 rounded-full border bg-[#071952] rounded hover:bg-[#041b4d] hover:text-white">
              <div className="font-medium text-white text-center items-center m-auto">
                CV
              </div>
            </div>
            <div className="absolute w-[200px] border rounded border-solid border-black z-10 top-[55px] flex-col right-[2px] items-start hidden pb-1 bg-white shadow-lg group-focus:flex">
              <div
                onClick={() => navigate("/profile")}
                className="w-full font-semibold px-4 py-2 text-left hover:bg-gray-200"
              >
                Profile
              </div>
              <SignOut />
            </div>
          </button>
        </div>
        <div className="flex-grow p-6 overflow-auto bg-white px-20">
          <div className="p-6 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Feedback</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Rating:
                </label>
                <StarRating
                  rating={rating}
                  onRatingChange={handleRatingChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="comment"
                >
                  Comment:
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  rows="4"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  placeholder="Write your feedback here..."
                ></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
