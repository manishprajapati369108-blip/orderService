import api from "../../utils/axios.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRestaurant = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //helping function for the uploading
  const onUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("auth/avatar", formData);
      setAvatar(response?.data?.url);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.error);
    }
  };

  // uploading the avatar

  const handleUploadImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return;

    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  //group dtails sending
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: name,
        avatar: avatar,
      };
      await api.post("/restaurant/create", data);

      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      setError("Server Problem , Try Again");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        {error && (
          <div>
            <p className="text-[red]">{error}</p>
          </div>
        )}
        <label htmlFor="avatar" className="cursor-pointer">
          {preview ? (
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover scale-125"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-600 text-xs">
              Upload
            </div>
          )}

          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
          />
        </label>

        <div className="text-sm text-gray-500">
          Click the circle to upload an avatar
        </div>
      </div>

      {/* Name section */}
      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <button
          className="bg-green-400 text-amber-50 font-bold mt-6 mx-auto block px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CreateRestaurant;
