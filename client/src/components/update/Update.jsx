import { useContext, useState, useEffect } from "react";
import "./Update.scss";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setopenupdate, user }) => {
  const [account_type, setAccountType] = useState(null);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser && currentUser.data && currentUser.data.user) {
      setAccountType(currentUser.data.user.account_type);
    }
  }, [currentUser]);

  const [cover, setCover] = useState(null);
  const [Profile, setProfile] = useState(null);
  const [inputs, setInputs] = useState({ ...user });
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (user) => {
      try {
        let endpoint;
        if (account_type === "person") {
          endpoint = "/persons";
        } else if (account_type === "organization") {
          endpoint = `/organizations/${currentUser.data.user.user_id}`;
        } else if (account_type === "institute") {
          endpoint = `/institutes/${currentUser.data.user.user_id}`;
        }

        const response = await makeRequest.put(endpoint, user);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["persons"]);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const handleclick = async (e) => {
    e.preventDefault();
    let Cover_url = user.CoverPic;
    let Profile_url = user.ProfilePic;

    Cover_url = cover && (await upload(cover));
    Profile_url = Profile && (await upload(Profile));

    const updatedUser = {
      user_id: currentUser.data.user.user_id,
      CoverPic: Cover_url || inputs.CoverPic,
      ProfilePic: Profile_url || inputs.ProfilePic,
      city: inputs.city || currentUser.data.user.city,
      state: inputs.state || currentUser.data.user.state,
      country: inputs.country || currentUser.data.user.country,
      username: inputs.username || currentUser.data.user.username
    };

    if (account_type === "person") {
      updatedUser.first_name = inputs.first_name;
      updatedUser.last_name = inputs.last_name;
    } else if (account_type === "organization") {
      updatedUser.name = inputs.name;
      updatedUser.industry = inputs.industry;
      updatedUser.description = inputs.description;
      updatedUser.website_url = inputs.website_url;
      updatedUser.contact = inputs.contact;
    } else if (account_type === "institute") {
      console.log("Z");
      updatedUser.name = inputs.name;
      updatedUser.institute_type = inputs.institute_type;
      updatedUser.description = inputs.description;
      updatedUser.website_url = inputs.website_url;
      updatedUser.contact = inputs.contact;
    }

    mutation.mutate(updatedUser);

    setCurrentUser((prevUser) => ({
      ...prevUser,
      username: inputs.username,
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      city: inputs.city,
      state: inputs.state,
      country: inputs.country,
      CoverPic: Cover_url || inputs.CoverPic,
      ProfilePic: Profile_url || inputs.ProfilePic,
    }));

    setopenupdate(false);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.CoverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              onChange={(e) => setCover(e.target.files[0])}
              name="cover"
              style={{ display: "none" }}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    Profile
                      ? URL.createObjectURL(Profile)
                      : "/upload/" + user.ProfilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          {account_type === "person" && (
            <>
              <label>First Name</label>
              <input
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                name="first_name"
                value={inputs.first_name}
              />
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                name="last_name"
                value={inputs.last_name}
              />
            </>
          )}
          {account_type === "institute" && (
            <>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                onChange={handleChange}
                name="name"
                value={inputs.name}
              />
              <label>Institute Type</label>
              <input
                type="text"
                placeholder="Institute Type"
                onChange={handleChange}
                name="institute_type"
                value={inputs.institute_type}
              />
              <label>Description</label>
              <input
                type="text"
                placeholder="Description"
                onChange={handleChange}
                name="description"
                value={inputs.description}
              />
              <label>Website URL</label>
              <input
                type="text"
                placeholder="Website URL"
                onChange={handleChange}
                name="website_url"
                value={inputs.website_url}
              />
              <label>Contact</label>
              <input
                type="text"
                placeholder="Contact"
                onChange={handleChange}
                name="contact"
                value={inputs.contact}
              />
            </>
          )}
          {account_type === "organization" && (
            <>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                onChange={handleChange}
                name="name"
                value={inputs.name}
              />
              <label>Industry</label>
              <input
                type="text"
                placeholder="Industry"
                onChange={handleChange}
                name="industry"
                value={inputs.industry}
              />
              <label>Description</label>
              <input
                type="text"
                placeholder="Description"
                onChange={handleChange}
                name="description"
                value={inputs.description}
              />
              <label>Website URL</label>
              <input
                type="text"
                placeholder="Website URL"
                onChange={handleChange}
                name="website_url"
                value={inputs.website_url}
              />
              <label>Contact</label>
              <input
                type="text"
                placeholder="Contact"
                onChange={handleChange}
                name="contact"
                value={inputs.contact}
              />
            </>
          )}
                    <div>
            <label>City</label>
            <input
              type="text"
              placeholder="City"
              onChange={handleChange}
              name="city"
              value={inputs.city}
            />
          </div>

          <div>
            <label>State</label>
            <input
              type="text"
              placeholder="State"
              onChange={handleChange}
              name="state"
              value={inputs.state}
            />
          </div>
          <div>
            <label>Country</label>
            <input
              type="text"
              placeholder="Country"
              onChange={handleChange}
              name="country"
              value={inputs.country}
            />
          </div>
          <div>
                      <label>Username</label>
                      <input
                        type="text"
                        placeholder="Username"
                        onChange={handleChange}
                        name="username"
                        value={inputs.username}
                      />
                    </div>
          <button onClick={handleclick}>Update</button>
        </form>
        <button className="close" onClick={() => setopenupdate(false)}>
          X
        </button>
      </div>
    </div>
  );
};

export default Update;
