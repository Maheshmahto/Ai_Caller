
const ProfileSettings = () => {
  return (
    <div className=" bg-gray-100 p-6 flex justify-end opacity-40">
      <div className="max-w-md   bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>

        <div className="space-y-4">
          {/* Admin Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              A
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Admin</p>
              <p className="text-sm text-gray-500">admin</p>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-800">admin@gmail.com</p>
            </div>
          </div>

          {/* Update Password Button */}
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
            Update Password
          </button>

          {/* Logout Button */}
          <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;