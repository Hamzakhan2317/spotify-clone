import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { url } from '../App';

const AddAlbum = () => {
  const [image, setImage] = useState(null);
  const [colour, setColour] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image || !colour || !name || !desc) {
      toast.warn("Please fill in all fields");
      return;
    }

    console.log('Submitting form with:', { image, colour, name, desc });

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('bgColour', colour);

      const response = await axios.post(`${url}/api/album/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', response.data);

      if (response.data.message?.toLowerCase().includes("success")) {
        toast.success(response.data.message || "✅ Album uploaded successfully!");
        setImage(null);
        setColour("#121212");
        setName("");
        setDesc("");
      } else {
        toast.error("Upload failed: " + (response.data.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
    </div>
  ) : (
    <form className='flex flex-col items-start gap-8 text-gray-600' onSubmit={onSubmitHandler}>
      {/* Upload Image */}
      <div className='flex flex-col gap-4'>
        <p>Upload Image</p>
        <input
          type="file"
          id='image'
          accept='image/*'
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            console.log('Selected image file:', file);
            setImage(file);
          }}
        />
        <label htmlFor="image">
          <img
            className='w-24 cursor-pointer'
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Upload"
          />
        </label>
      </div>

      {/* Album Name */}
      <div className='flex flex-col gap-2.5 w-[max(40vw,250px)]'>
        <p>Album name</p>
        <input
          className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Album Description */}
      <div className='flex flex-col gap-2.5 w-[max(40vw,250px)]'>
        <p>Album description</p>
        <input
          className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5'
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
      </div>

      {/* Background Color */}
      <div className='flex flex-col gap-3'>
        <p>Background Colour</p>
        <input
          type="color"
          value={colour}
          onChange={(e) => setColour(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;
