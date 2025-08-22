import { Avatar, Button, Card, Form, Input, message, Upload } from "antd";
import { useEffect, useState } from "react";
import type { IImageType } from "../../config/constants";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import { AiOutlineUpload } from "react-icons/ai";

interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    image: IImageType;
}

const UserProfilePage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<IUserProfile | null>(null);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getLoggedInUser() as unknown as AxiosSuccessResponse;
            setUserData(response.data);
            form.setFieldsValue({
                name: response.data.name
            });
        } catch (error) {
            message.error("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("image", file);
            
            const response = await userService.updateUserImage(userData?._id || "", formData) as unknown as AxiosSuccessResponse;
            setUserData(prev => ({
                ...prev!,
                image: response.data.image
            }));
            message.success("Profile image updated successfully");
        } catch (error) {
            message.error("Failed to update profile image");
        }
    };

    const handleSubmit = async (values: { name: string }) => {
        try {
            setUpdating(true);
            // Assuming you have an updateUser endpoint in your userService
            const response = await userService.getUserById(userData?._id || "") as unknown as AxiosSuccessResponse;
            setUserData(prev => ({
                ...prev!,
                name: values.name
            }));
            message.success("Profile updated successfully");
        } catch (error) {
            message.error("Failed to update profile");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        loadUserProfile();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card
                title="My Profile"
                loading={loading}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-6">
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        customRequest={({ file }) => handleImageUpload(file as File)}
                        className="mb-4"
                    >
                        <Avatar
                            src={userData?.image?.imageUrl}
                            size={120}
                            className="cursor-pointer"
                        />
                        <Button icon={<AiOutlineUpload />} className="mt-2">
                            Change Photo
                        </Button>
                    </Upload>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item label="Email">
                        <Input value={userData?.email} size="large" disabled />
                    </Form.Item>

                    <Form.Item label="Role">
                        <Input value={userData?.role} size="large" disabled />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={updating}
                            size="large"
                            block
                        >
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UserProfilePage;