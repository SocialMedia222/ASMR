import { IoMdClose } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { BiLogOutCircle } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { TfiWrite } from "react-icons/tfi";
import { SiAboutdotme } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { FaEdit } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { logout_success, update_username, update_email, update_bio } from "../../Redux/userSlice";

function UserProfile() {
  const [loggedinUser, setLoggedinUser] = useState(false);
  const [userPageDetails, setUserPageDetails] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const user = useSelector((state) => state.user.user);
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editUser, setEditUser] = useState({ username: user?.details?.username, email: user?.details?.email, bio: user?.details?.bio, password: "", image: user?.details?.profileImg });
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // States to control the dropdown for each form fields
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showBioInput, setShowBioInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [showFollowing, setShowFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  const handleShowfollowing = async () => {
    setShowFollowing(true);

    try {
      if (userPageDetails?.following) {
        const updatedFollowing = [];

        for (const id of userPageDetails.following) {
          const details = await axios.get(
            `${import.meta.env.VITE_API_USER_URL}/${id}/getbyid`
          );
          updatedFollowing.push({ username: details.data.user.username, image: details.data.user.profileImg });
        }

        setFollowing(updatedFollowing);
      }
    } catch (error) {
      toast.error('Error fetching followings!');
    }
  };


  const handleShowfollowers = async () => {
    setShowFollowers(true);

    try {
      if (userPageDetails?.followers) {
        const updatedFollowers = [];

        for (const id of userPageDetails.followers) {
          const details = await axios.get(
            `${import.meta.env.VITE_API_USER_URL}/${id}/getbyid`
          );
          updatedFollowers.push({ username: details.data.user.username, image: details.data.user.profileImg });
        }

        setFollowers(updatedFollowers);
      }
    } catch (error) {
      toast.error('Error fetching followers!');
    }
  }

  const handleClose = () => {
    setShow(false);
    setShowFollowers(false);
    setShowFollowing(false);
    setEditUser({ username: user?.details?.username, email: user?.details?.email, bio: user?.details?.bio, password: "", image: user?.details?.profileImg });
    setImagePreview(null);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (name === user.details.username || name === undefined) {
      setLoggedinUser(true);
      const username = user.details.username;
      fetchUser(username);
    } else {
      setLoggedinUser(false);
      fetchUser(name);
    }
  }, [name, user]);

  const fetchUser = async (name) => {
    try {
      const details = await axios.get(
        `${import.meta.env.VITE_API_USER_URL}/${name}`
      );
      setUserPageDetails(details.data.user);
    } catch (error) {
      toast.error(error.response.data.message);
      navigate("/");
    }
  };

  const reqConfig = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleFollow = async (id) => {
    try {
      const follow = await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/follow`,
        {},
        reqConfig
      );
      fetchUser(name);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const follow = await axios.put(
        `${import.meta.env.VITE_API_USER_URL}/${id}/unfollow`,
        {},
        reqConfig
      );
      fetchUser(name);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleProfileChange = () => {
    const userFile = document.createElement("input");
    userFile.type = "file";
    userFile.accept = ".jpg, .jpeg, .png";
    userFile.click();

    userFile.onchange = async (e) => {
      e.preventDefault()
      const file = e.target.files[0];

      if (file) {
        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
        setEditUser({ ...editUser, image: file });
      } else {
        setImagePreview(null);
        setEditUser({ ...editUser, image: null });
      }
    };
  };

  const handleAddImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', editUser.image);
      const res = await axios.put(`${import.meta.env.VITE_API_USER_URL}/${user.details._id}/uploadImage`, formData, reqConfig);
      toast.success('Profile Image updated!');
      setShow(false);
      setImagePreview(null);
      fetchUser(user.details.username);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }

  const handleLogout = async () => {
    dispatch(logout_success());
    toast.success('You are logged out!');
    navigate('/authentication');
  }

  const handleEditUsername = async () => {
    try {
      const updateUsername = await axios.put(`${import.meta.env.VITE_API_USER_URL}/editUsername`, { username: editUser.username }, reqConfig);
      dispatch(update_username({ username: editUser.username }));
      setShow(false);
      toast.success('Username updated!');
      fetchUser(editUser.username);
    } catch (error) {
      if (error.response.data.error.codeName === "DuplicateKey") {
        toast.error("Username already registered!");
      }
      else toast.error('Something went wrong!');
    }
  }

  const handleEditBio = async () => {
    try {
      const updateBio = await axios.put(`${import.meta.env.VITE_API_USER_URL}/editBio`, { bio: editUser.bio }, reqConfig);
      dispatch(update_bio({ bio: editUser.bio }));
      setShow(false);
      toast.success('Bio updated!');
      fetchUser(user.details.username);
    } catch (error) {
      toast.error('Something went wrong!');
    }
  }

  const handleEditPassword = async () => {
    setChangingPassword(true);
    try {
      const updatePassword = await axios.put(`${import.meta.env.VITE_API_USER_URL}/editPassword`, { password: editUser.password }, reqConfig);
      setShow(false);
      setEditUser({ ...editUser, password: "" });
      toast.success('Password updated!');
      fetchUser(user.details.username);
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <>
      {loggedinUser ? (
        <div className="profile-page d-flex justify-center align-middle overflow-x-hidden no-scrollbar">
          <div className="row g-0 shadow-lg profile-visible glass-effect no-scrollbar pb-4">
            <div className="text-center mt-4">
              <div
                className="mx-auto my-3 relative"
                style={{ width: "11%" }}
              // id="image-container"
              >
                <img
                  src={userPageDetails?.profileImg}
                  alt="profile"
                  className="mx-auto profile-img"
                />
              </div>
              <div className="d-flex justify-center items-center gap-3">
                <h3 className="text-light fs-4 fw-bold">
                  {userPageDetails?.username}
                </h3>
                <button
                  className="text-gray-200 hover:text-white border-gray-200 hover:border-gray-400"
                  onClick={handleShow}
                >
                  <CiSettings size={27} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center">
                <span className="text-light" onClick={() => handleShowfollowers()} style={{ cursor: "pointer" }}>
                  {userPageDetails?.followers.length} Followers
                </span>
                <span className="text-light ms-4" onClick={() => handleShowfollowing()} style={{ cursor: "pointer" }}>
                  {userPageDetails?.following.length} Following
                </span>
              </div>
              <p className="text-gray-400 mt-2">{userPageDetails?.bio}</p>
              <br />
              <div className="row justify-center mt-3 posts-row no-scrollbar">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    className="profile-image-container col-md-3 m-3 overflow-hidden"
                    key={index}
                  >
                    <img
                      className="profile-image rounded"
                      src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-page d-flex justify-center align-middle">
          <div className="row g-0 shadow-lg profile-visible mt-5 mb-5 rounded">
            <div className="text-center">
              <img
                src={userPageDetails?.profileImg}
                alt="profile"
                className="mx-auto mt-3 profile-img"
              />
              <div className="d-flex justify-center">
                <h3 className="text-light mt-3 fs-4 fw-bold ms-5">
                  {userPageDetails?.username}
                </h3>
                {/* <button
                  className={`mt-3 fs-6 ms-3 btn btn-${follow ? 'light' : 'primary'}`}
                  onClick={() => setFollow((prev) => !prev)}
                >
                  {follow ? 'Unfollow' : 'Follow'}
                </button> */}
                {userPageDetails?.followers.includes(user.details._id) ? (
                  <button
                    className="mt-3 fs-6 ms-3 btn btn-light"
                    onClick={() => handleUnfollow(userPageDetails?._id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="mt-3 fs-6 ms-3 btn btn-primary"
                    onClick={() => handleFollow(userPageDetails?._id)}
                  >
                    Follow
                  </button>
                )}
              </div>
              <div className="mt-2">
                <span className="text-light">
                  {userPageDetails?.followers.length} Followers
                </span>
                <span className="text-light ms-4">
                  {userPageDetails?.following.length} Following
                </span>
              </div>
              <p className="text-secondary mt-2">{userPageDetails?.bio}</p>
              <br />
              <hr className="line" style={{ border: "2px solid white" }} />
              <div className="row justify-around mt-3 posts-row no-scrollbar">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div className="col-md-3 m-3" key={index}>
                    <img src="https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose} centered>
        {/* <Modal.Header closeButton>
          <Modal.Title className="fs-5 glass-effect">Edit Profile</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="container">
            {/* Change Profile Picture */}
            <div className="mx-auto my-3 relative" style={{ width: "35%" }}>
              <img
                src={imagePreview ? imagePreview : userPageDetails?.profileImg}
                alt="profile"
                className="mx-auto profile-img"
              />
              <FaEdit
                size={22}
                color="white"
                className="absolute right-3 bottom-2 cursor-pointer"
                onClick={handleProfileChange}
              />

            </div>
            {imagePreview ?
              <div className="text-center">
                <button className="btn rounded-e rounded-l-none" onClick={() => setImagePreview(null)}>
                  <IoMdClose size={20} color="white" />
                </button>
                <button className="btn rounded-e bg-red-600 hover:bg-red-700 rounded-l-none" onClick={() => handleAddImage()}>
                  <MdDone size={20} color="white" />
                </button>
              </div>
              : ''}
            <div className="ml-20 my-3">
              {/* Change Username */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <CgProfile
                  size={29}
                  onClick={() => setShowUserNameInput(!showUserNameInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowUserNameInput(!showUserNameInput)}
                  >
                    Change Username
                  </span>
                  {showUserNameInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.username}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      />
                      <button className="btn rounded-e rounded-l-none" onClick={() => handleEditUsername()}>
                        {/* TODO: Close the dropdown for each input once successfully submited the response */}
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Bio */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <TfiWrite
                  size={27}
                  onClick={() => setShowBioInput(!showBioInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowBioInput(!showBioInput)}
                  >
                    Change Bio
                  </span>
                  {showBioInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.bio}
                        onChange={(e) => setEditUser({ ...editUser, bio: e.target.value })}
                      />
                      <button className="btn rounded-e rounded-l-none" onClick={() => handleEditBio()}>
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Email */}
              {/* <div className="flex items-center gap-3 p-2 rounded mb-1">
                <AiOutlineMail
                  size={29}
                  onClick={() => setShowEmailInput(!showEmailInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowEmailInput(!showEmailInput)}
                  >
                    Change Email
                  </span>
                  {showEmailInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.email}
                        onChange={(e)=>setEditUser({...editUser,email:e.target.value})}
                      />
                      <button className="btn rounded-e rounded-l-none" onClick={()=>handleEditEmail()}>
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Change Password */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <RiLockPasswordLine
                  size={29}
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() => setShowPasswordInput(!showPasswordInput)}
                  >
                    Change Password
                  </span>
                  {showPasswordInput && (
                    <div className="flex">
                      <input
                        type="text"
                        className="form-control bg-transparent text-white p-1 ps-2"
                        value={editUser?.password}
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                      />
                      <button className="btn rounded-e rounded-l-none" onClick={() => { handleEditPassword() }} disabled={changingPassword ? true : false}>
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* LogOut */}
              <div className="flex items-center gap-3 p-2 rounded mb-1">
                <AiOutlineLogout
                  size={29}
                  onClick={() =>
                    setShowLogoutConfirmation(!showLogoutConfirmation)
                  }
                  className="cursor-pointer"
                />
                <div className="">
                  <span
                    style={{ fontSize: "19px", cursor: "pointer" }}
                    onClick={() =>
                      setShowLogoutConfirmation(!showLogoutConfirmation)
                    }
                  >
                    Logout
                  </span>
                  {showLogoutConfirmation && (
                    <div className="flex">
                      <p className="text-red-300">
                        Are you sure, you want to logout?
                      </p>
                      <button
                        className="btn rounded-e rounded-l-none"
                        onClick={() =>
                          setShowLogoutConfirmation(!showLogoutConfirmation)
                        }
                      >
                        <IoMdClose size={20} color="white" />
                      </button>
                      <button className="btn rounded-e bg-red-600 hover:bg-red-700 rounded-l-none" onClick={() => handleLogout()}>
                        <MdDone size={20} color="white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showFollowing} onHide={handleClose} centered backdrop={true}>
        <Modal.Body>
          <h1 className="text-xl mb-2">Followings</h1>
          <hr />
          {following.length === 0 ? <><h3 className="mt-3 text-gray-400">You don't follow anyone!</h3></> : <>
            {following?.map((user, index) => (
              <div key={index} className="mt-3 text-center">
                <img src={user.image} className="mx-auto" width="50px" />
                <p key={index}>{user.username}</p>
              </div>
            ))}
          </>}
        </Modal.Body>
      </Modal>

      <Modal show={showFollowers} onHide={handleClose} centered>
        <Modal.Body>
          <h1 className="text-xl mb-2">Followers</h1>
          <hr />
          {followers.length === 0 ? <><h3 className="mt-3 text-gray-400">You have no followers!</h3></> : <>
            {followers?.map((user, index) => (
              <div key={index} className="mt-3 text-center">
                <img src={user.image} className="mx-auto" width="50px" />
                <p key={index}>{user.username}</p>
              </div>
            ))}</>
          }
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserProfile;
