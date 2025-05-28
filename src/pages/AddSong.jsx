import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

const onSubmitHandler = async (e) => {
  e.preventDefault();
  if (!image || !song || !name || !desc) {
    toast.warn("Please fill in all fields");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('image', image);
    formData.append('audio', song);
    formData.append('album', selectedAlbumId || "");

    const selectedAlbum = albumData.find(album => album._id === selectedAlbumId);
    console.log("🚀 Album ID gửi đi:", selectedAlbum ? selectedAlbum.name : "No album selected");

    const response = await axios.post(`${url}/api/song/add`, formData);

    console.log("✅ Server response:", response.data);

    if (response.data.message?.toLowerCase().includes("success")) {
      toast.success(response.data.message || "Song uploaded successfully!");
      setImage(null);
      setSong(null);
      setName("");
      setDesc("");
      setSelectedAlbumId("");
    } else {
      toast.error("Upload failed: " + (response.data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("❌ Upload failed:", error);
    toast.error("Upload failed. Please check your server or internet connection.");
  } finally {
    setLoading(false);
  }
};


  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      console.log("🔍 Album data response:", response.data);

      if (Array.isArray(response.data)) {
        setAlbumData(response.data);
      } else if (response.data.success) {
        setAlbumData(response.data.albums || []);
      } else {
        toast.error("Unable to load albums data");
      }
    } catch (error) {
      console.error("❌ Error fetching album:", error);
      toast.error("Error occurred while fetching albums");
    }
  };

  useEffect(() => {
    let ignore = false;
    if (!ignore) loadAlbumData();
    return () => { ignore = true; };
  }, []);

  const getSelectedAlbumName = () => {
    const album = albumData.find((a) => a._id === selectedAlbumId);
    return album ? album.name : "No Album Selected";
  };

  if (loading && albumData.length === 0) {
    return (
      <div className='grid place-items-center min-h-[80vh]'>
        <div className='w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>Upload song</p>
          <input
            onChange={(e) => setSong(e.target.files[0])}
            type="file"
            id="song"
            accept="audio/*"
            className="hidden"
          />
          <label htmlFor="song" className="cursor-pointer">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              className="w-24"
              alt="Upload song"
            />
          </label>
          {song && <p>Selected: {song.name}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
          />
          <label htmlFor="image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="w-24"
              alt="Upload image"
            />
          </label>
          {image && <p>Selected: {image.name}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song name</p>
        <input
          type="text"
          placeholder="Enter song name"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Song description</p>
        <input
          type="text"
          placeholder="Enter song description"
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album</p>
        <select
          value={selectedAlbumId}
          onChange={(e) => setSelectedAlbumId(e.target.value)}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[200px]"
        >
          <option value="" disabled>-- Select an album --</option>
          <option value="">None</option>
          {albumData.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        {selectedAlbumId && (
          <p className="text-sm text-green-700">Selected Album: {getSelectedAlbumName()}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`text-base py-2.5 px-14 cursor-pointer ${
          loading ? 'bg-gray-400 text-white' : 'bg-black text-white'
        }`}
      >
        {loading ? 'Uploading...' : 'ADD'}
      </button>
    </form>
  );
};

export default AddSong;

