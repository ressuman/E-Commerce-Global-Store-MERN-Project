import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Loader1 } from "../../components/Loader";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const EditableField = ({ value, onChange, onSave, onCancel }) => (
  <div className="flex items-center">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg"
    />
    <button
      onClick={onSave}
      className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center"
    >
      <FaCheck className="mr-2" />
    </button>{" "}
    <button
      onClick={onCancel}
      className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg flex items-center"
    >
      <FaTimes className="mr-2" />
    </button>
  </div>
);

export default function UserList() {
  const { data: users, refetch, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // const [editableUserId, setEditableUserId] = useState(null);
  // const [editableUserName, setEditableUserName] = useState("");
  // const [editableUserEmail, setEditableUserEmail] = useState("");

  const [editableNameUserId, setEditableNameUserId] = useState(null); // Track editable name user
  const [editableEmailUserId, setEditableEmailUserId] = useState(null); // Track editable email user
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  // const toggleEdit = (id, username, email) => {
  //   setEditableUserId(id);
  //   setEditableUserName(username);
  //   setEditableUserEmail(email);
  // };

  // const cancelEdit = () => {
  //   setEditableUserId(null);
  //   setEditableUserName("");
  //   setEditableUserEmail("");
  // };

  const toggleEditName = (id, username) => {
    setEditableNameUserId(id);
    setEditableUserName(username);
    setEditableEmailUserId(null); // Ensure only name is editable
  };

  const toggleEditEmail = (id, email) => {
    setEditableEmailUserId(id);
    setEditableUserEmail(email);
    setEditableNameUserId(null); // Ensure only email is editable
  };

  const cancelEdit = () => {
    setEditableNameUserId(null);
    setEditableEmailUserId(null);
    setEditableUserName("");
    setEditableUserEmail("");
  };

  // const updateHandler = async (id) => {
  //   try {
  //     await updateUser({
  //       userId: id,
  //       username: editableUserName,
  //       email: editableUserEmail,
  //     }).unwrap();
  //     setEditableUserId(null);
  //     refetch();
  //     toast.success("User updated successfully.");
  //   } catch (err) {
  //     toast.error(err?.data?.message || err.error);
  //   }
  // };

  const updateHandler = async (id, field) => {
    try {
      const payload =
        field === "name"
          ? { userId: id, username: editableUserName }
          : { userId: id, email: editableUserEmail };
      await updateUser(payload).unwrap();
      setEditableNameUserId(null);
      setEditableEmailUserId(null);
      refetch();
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  let content;
  if (isLoading) {
    content = <Loader1 />;
  } else if (error) {
    content = (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );
  } else {
    content = (
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <table className="w-full  md:w-4/5 mx-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">NAME</th>
              <th className="px-4 py-2 text-left">EMAIL</th>
              <th className="px-4 py-2 flex items-center justify-center">
                ADMIN
              </th>
              <th className="px-4 py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">
                  {editableNameUserId === user._id ? (
                    <EditableField
                      value={editableUserName}
                      onChange={(e) => setEditableUserName(e.target.value)}
                      onSave={() => updateHandler(user._id, "name")}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <div className="flex items-center">
                      {user.username}
                      <button
                        onClick={() => toggleEditName(user._id, user.username)}
                        className="ml-4"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editableEmailUserId === user._id ? (
                    <EditableField
                      value={editableUserEmail}
                      onChange={(e) => setEditableUserEmail(e.target.value)}
                      onSave={() => updateHandler(user._id, "email")}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <div className="flex items-center">
                      <a href={`mailto:${user.email}`}>{user.email}</a>{" "}
                      <button
                        onClick={() => toggleEditEmail(user._id, user.email)}
                        className="ml-4"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500 text-center mx-auto flex" />
                  ) : (
                    <FaTimes className="text-red-500 text-center mx-auto flex" />
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {!user.isAdmin && (
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-4 ml-16">
      <h1 className="text-2xl font-semibold mb-4 text-center">Users</h1>
      {content}
    </div>
  );
}
