import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout, reset, searchUser, getAllUsers } from "../../features/adminauth/adminAuthSlice";
import { FaSearch } from "react-icons/fa";
import Userlist from "./Userlist";

const Admindashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { admin} = useSelector((state) => state.adminAuth);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!admin) {
      console.log("hi")
      navigate("/admin");
      return
    } else {
      if (searchQuery.trim()) {
        dispatch(searchUser(searchQuery));
      } else {
        dispatch(getAllUsers());
      }
    }
    console.log("Hello")
  
    return () => {
      dispatch(reset());
    };
  }, [dispatch, admin, searchQuery, navigate]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      dispatch(searchUser(searchQuery));
    }
  };
  
  const onLogout = () => {
    dispatch(adminLogout());
    dispatch(reset());
    navigate("/admin");
  };
  
  const onAddUser = () => {
    navigate("/admin/adduser");
  };

  return (
    <div className="container-1" style={{ padding: "20px" }}>
      <div className="nav" style={{ marginBottom: "20px" }}>
        <h3>Admin Dashboard</h3>
        <div style={{ display: "flex", alignItems: "center" }} className="form-grp">
          <input
            style={{ height: "35px", marginRight: "10px", flex: "1" }}
            className="form-ctr"
            placeholder="username/email"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button style={{ height: "35px" }} className="btn-111" onClick={handleSearchClick}>
            <FaSearch /> Search
          </button>
        </div>
      </div>

      <div className="prof" style={{ display: "flex", alignItems: "center" }}>
        <div className="prof-image" style={{ marginRight: "20px" }}>
          <img
            src={admin?.image || "https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small/user-profile-icon-free-vector.jpg"}
            alt="profile"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
        <div className="prof-card">
          <div className="prof-info" style={{ marginBottom: "10px" }}>
            <p><strong>Name:</strong> {admin?.name || "N/A"}</p>
            <p><strong>Email:</strong> {admin?.email || "N/A"}</p>
          </div>
          <div className="prof-buttons">
            <button onClick={onAddUser} className="btn-111" style={{ marginRight: "10px" }}>
              Add User
            </button>
            <button onClick={onLogout} className="btn-111">
              Logout
            </button>
          </div>
        </div>
      </div>

      <Userlist />
    </div>
  );
};

export default Admindashboard;
