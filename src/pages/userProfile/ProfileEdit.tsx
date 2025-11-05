import { useState, useEffect } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
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

const EditProfilePage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<IUserProfile | null>(null);
  const navigate = useNavigate();

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = (await authService.getLoggedInUser()) as unknown as AxiosSuccessResponse;
      setUserData(response.data);
      form.setFieldsValue({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        address: response.data.address || "",
      });
    } catch (error) {
      message.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string; phone: string; address: string }) => {
    try {
      setUpdating(true);
      const response = (await userService.updateUser(
        userData?._id || "",
        values
      )) as unknown as AxiosSuccessResponse;
      
      setUserData(prev => ({
        ...prev!,
        ...values
      }));
      message.success("Profile updated successfully");
      navigate('/admin/me');
    } catch (error) {
      message.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="px-6 py-6"
          >
            <div className="space-y-6">
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input 
                  size="large"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
              >
                <Input 
                  size="large"
                  disabled
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
              >
                <Input 
                  size="large"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
              >
                <Input.TextArea 
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </Form.Item>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                onClick={() => navigate('/admin/me')}
                size="large"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                size="large"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;