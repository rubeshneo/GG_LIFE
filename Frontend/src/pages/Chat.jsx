import { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch users");
          return;
        }

        
        const filteredUsers = (data.data || []).filter(
          (u) => u._id !== user.id
        );

        setUserDetails(filteredUsers);
      } catch (err) {
        setError("Something went wrong while fetching users");
      }
    };

    if (user) fetchUsers();
  }, [user]);

  
  useEffect(() => {
    if (!user || !token) return;

    socket.connect();

    socket.emit("userOnline", user);

    const handleReceiveMessage = (data) => {
      setConversations((prev) => ({
        ...prev,
        [data.senderId]: [
          ...(prev[data.senderId] || []),
          data,
        ],
      }));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.disconnect();
    };
  }, [user]);

  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;

    const msgData = {
      senderId: user.id,
      receiverId: selectedUser._id,
      text: message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("privateMessage", msgData);

    setConversations((prev) => ({
      ...prev,
      [selectedUser._id]: [
        ...(prev[selectedUser._id] || []),
        msgData,
      ],
    }));

    setMessage("");
  };

  const currentMessages = selectedUser
    ? conversations[selectedUser._id] || []
    : [];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-4">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          Users
        </h2>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {userDetails.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          userDetails.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                selectedUser?._id === u._id
                  ? "bg-green-100"
                  : "hover:bg-green-50"
              }`}
            >
              {u.firstname}
            </div>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        <div className="bg-green-600 text-white p-4 font-semibold">
          {selectedUser
            ? `Chat with ${selectedUser.firstname}`
            : "Select a user to start chatting"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {currentMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.senderId === user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.senderId === user.id
                    ? "bg-green-600 text-white"
                    : "bg-white border"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs block mt-1 opacity-70">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="bg-white p-4 border-t flex">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 outline-none"
            />

            <button
              onClick={handleSend}
              className="ml-3 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}