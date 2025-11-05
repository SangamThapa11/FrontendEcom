import { useState, useEffect } from "react";
import { Avatar, Button, Spin, message } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { Gender, Status, UserRoles } from "../../config/constants";
import authService from "../../services/auth.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import type { IImageType } from "../../config/constants";
import { useNavigate } from "react-router";

interface IUserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: IImageType;
  gender: string;
  status: string;
  phone: string;
  address: string;
}

const UserProfilePage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<IUserProfile | null>(null);
  const navigate = useNavigate();

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = (await authService.getLoggedInUser()) as unknown as AxiosSuccessResponse;
      setUserData(response.data);
    } catch (error) {
      message.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch(role) {
      case UserRoles.ADMIN: return "Admin";
      case UserRoles.SELLER: return "Seller";
      case UserRoles.CUSTOMER: return "Customer";
      default: return role;
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch(gender) {
      case Gender.MALE: return "Male";
      case Gender.FEMALE: return "Female";
      case Gender.OTHER: return "Other";
      default: return gender;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case Status.ACTIVE: return "Active";
      case Status.INACTIVE: return "Inactive";
      default: return status;
    }
  };

  const getImageUrl = () => {
    if (!userData?.image) return "/images/default-avatar.png";
    
    if (typeof userData.image === 'string') {
      return userData.image;
    } else if (userData.image?.imageUrl) {
      return userData.image.imageUrl;
    }
    
    return "/images/default-avatar.png";
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-200 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-300 shadow rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={getImageUrl()}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-purple-100 mt-2">{userData.email}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start mt-4 gap-2">
                  <span className="bg-purple-700 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                    {getRoleDisplay(userData.role)}
                  </span>
                  <span className="bg-purple-700 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                    {getGenderDisplay(userData.gender)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    userData.status === Status.ACTIVE 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {getStatusDisplay(userData.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-lg text-gray-900">{userData.name}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {userData.phone || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="mt-1 text-lg text-gray-900">{getGenderDisplay(userData.gender)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {userData.address || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                <p className="mt-1 text-lg text-gray-900">{getStatusDisplay(userData.status)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">User Role</h3>
                <p className="mt-1 text-lg text-gray-900">{getRoleDisplay(userData.role)}</p>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button
              icon={<AiOutlineEdit />}
              onClick={() => navigate('/admin/me/edit')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              size="large"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;