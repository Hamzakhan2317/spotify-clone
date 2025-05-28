import React from 'react'
import { ToastContainer } from 'react-toastify';

import { Routes, Route } from 'react-router-dom';

import ListSong from './pages/ListSong';
import ListAlbum from './pages/ListAlbum';
import AddAlbum from './pages/AddAlbum';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AddSong from './pages/AddSong';

export const url= 'http://localhost:4000'


const App = () => {
  return (
    <div className='flex items-start min-h-screen'>
      <ToastContainer />
     <Sidebar />

      <div className='flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'>
        <Navbar/>
        <div className='pt-8 pl-5 sm:pt-12 sm:pl-12'>
          <Routes>
            <Route path='add-song' element={<AddSong />} />
              <Route path='add-album' element={<AddAlbum />} />
            <Route path='list-album' element={<ListAlbum />} />
             <Route path='list-song' element={<ListSong />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
