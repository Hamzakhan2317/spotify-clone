import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setData(response.data);
      console.log("🎵 Fetched albums:", response.data);
    } catch (error) {
      console.error("❌ Error fetching albums:", error.message);
      toast.error("Error fetching albums");
    }
  };

  const removeAlbum = async (id) => {
    try {
      console.log("🗑️ Removing album with id:", id);
      const response = await axios.delete(`${url}/api/album/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchAlbums();
      }
    } catch (error) {
      console.error("❌ Error removing album:", error.message);
      toast.error("Error removing album");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p className='text-lg font-semibold mb-2'>All Albums List</p>
      <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'>
        <b>Image</b>
        <b>Name</b>
        <b>Description</b>
        <b>Colour</b>
        <b>Action</b>
      </div>

      {data.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'
        >
          <img className='w-12 h-12 object-cover' src={item.image} alt={item.name} />
          <p>{item.name}</p>
          <p>{item.desc}</p>
          <input type='color' value={item.bgColour} readOnly />
          <button
            onClick={() => removeAlbum(item._id)}
            className='cursor-pointer text-red-500 hover:underline'
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListAlbum;
