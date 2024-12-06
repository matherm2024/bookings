import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false); 
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const response = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (response.data.success) {  
        toast.success(response.data.message);
        await loadUserProfileData();
        setIsEdit(false);  
        setImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt=""
            />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={image ? '' : assets.upload_icon}
              alt=""
            />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="" />
      )}

      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p>Date of Birth:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="date"
              value={userData.dob}
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className="text-blue-400">{userData.dob}</p>
          )}
        </div>
      </div>
      <div>
        {isEdit ? (
          <button
            className="border border-gray-700 px-8 py-2 rounded-full hover:bg-gray-700 hover:text-white transition-all"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-gray-700 px-8 py-2 rounded-full hover:bg-gray-700 hover:text-white transition-all"
            onClick={() => setIsEdit(true)} 
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
