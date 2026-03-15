import ChangePasswordForm from "../components/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
